const socket = io('http://localhost:8008')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let globalBobSharedKey;

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  //decrypt here
  appendMessage(`${data.name}: ${decrypt(data.message, globalBobSharedKey)}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  //encrypt below
  socket.emit('send-chat-message', encrypt(message))
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function encrypt(message){

  //secp256k1 is the curve that bitcoin uses (a popular curve)
  //also gives us a shared secret that is 256 bits long

  const alice = crypto.createECDH('secp256k1');
  alice.generateKeys()

  const bob = crypto.createECDH('secp256k1');
  bob.generateKeys()

  const alicePubKey64 = alice.getPublicKey().toString('base64')
  const bobPubKey64 = bob.getPublicKey().toString('base64')

  //compute shared keys with input base 64 and output hex
  const aliceSharedKey = alice.computeSecret(bobPubKey64, 'base64', 'hex')
  const bobSharedKey = bob.computeSecret(alicePubKey64, 'base64', 'hex')

  globalBobSharedKey = bobSharedKey

  //alice's shared key is the same as bob's

  const MESSAGE = message


  //init vector;iv is like the salt of encrption
  //should be public and random, should be used one time per messsage
  //appended at the end of message

  const IV = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(aliceSharedKey, 'hex'), IV)


  //encrypt the message

  //message is type utf8 but we want an output of hex
  let encrypted = cipher.update(MESSAGE, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const auth_tag = cipher.getAuthTag().toLocaleString('hex')

  //test print
  console.table({
    IV: IV.toString,
    encrypted: encrypted,
    auth_tag: auth_tag
  })


  // //payload = IV + encrypted + auth tag

  // const payload = IV.toString('hex') + encrypted + auth_tag

  // const payload64 = Buffer.from(payload, 'hex').toString('base64')

  // globalPayload64 = payload64

  
  //Bob does these calculations

   //payload = IV + encrypted + auth tag
  
  const payload = IV.toString('hex') + encrypted + auth_tag

  const payload64 = Buffer.from(payload, 'hex').toString('base64')
  globalPayload64 = payload64
  
  return payload64
}

function decrypt(payload64, bobSharedKey){
 

  const bob_payload = Buffer.from(payload64, 'base64').toString('hex')

  const bob_iv = bob_payload.substr(0,32)
  //minus 32 for IV and 32 for auth tag
  const bob_encrypted = bob_payload.substr(32, bob_payload,length - 32 - 32)
  const bob_auth_tag = bob_payload.substr(bob_payload.length - 32, 32)

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(bobSharedKey, 'hex'), Buffer.from(bob_iv, 'hex'));

    decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'))

    let decrypted = decipher.update(bob_encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    console.table({
      IV: bob_iv.toString,
      decrypted: decrypted,
      auth_tag: bob_auth_tag
    })
    return decrypted

  } catch(error){
    console.log(error.message)
  }

}
