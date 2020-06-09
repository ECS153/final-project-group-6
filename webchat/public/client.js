const socket = io('http://localhost:8008')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const roomContainer = document.getElementById('room-container')
const roomInput = document.getElementById('room-input')
const userContainer =  document.getElementById('people')
const crypto = require('crypto')


if(messageForm != null){
    const name = prompt('What is your name?')
    appendYourMessage('You joined')
    appendUser(name)
    socket.emit('new-user', roomName,name)

    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendYourMessage(`You: ${message}`)
        //encrypt below
        socket.emit('send-chat-message', roomName,encrypt(message))
        messageInput.value = ''
    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'Join the Room'
    roomInput.value = '';
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  //decrypt here
    const msg = decrypt(data.message.payload, data.message.key)
    appendMessage(`${data.name}: ${msg}`)
})

socket.on('user-connected', name => {
    appendUser(name)
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
    var userElement = document.getElementById(name)
    userElement.remove()
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageElement.style.display = "inline-block"
  messageElement.style.float = "left"
  messageElement.style.maxWidth = "50vw"
  messageElement.style.overflowWrap = "break-word"
  messageElement.style.backgroundColor = "#e5e5e5"
  messageElement.style.color = "black"
  messageElement.style.borderRadius = ".9em"
  messageElement.style.padding = "5px 12.5px 5px 12.5px"
  messageElement.style.margin = "0.5% 50% 0.5% 5%"

  messageContainer.append(messageElement)
}

function appendYourMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageElement.style.display = "inline-block"
  messageElement.style.float = "right"
  messageElement.style.maxWidth = "50vw"
  messageElement.style.overflowWrap = "break-word"
  messageElement.style.backgroundColor = "#b191d4"
  messageElement.style.color = "white"
  messageElement.style.borderRadius = ".9em"
  messageElement.style.padding = "5px 12.5px 5px 12.5px"
  messageElement.style.margin = "0.5% 5% 0.5% 50%"

  // messageElement.style.position = "relative"


  messageContainer.append(messageElement)
}

function appendUser(user){
    const userElement = document.createElement('div')
    userElement.id = user
    userElement.innerText = user
    userContainer.append(userElement)
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
    IV: IV.toString('hex'),
    encrypted: encrypted,
    auth_tag: auth_tag
  })

   //payload = IV + encrypted + auth tag
    const payload = IV.toString('hex') + encrypted + auth_tag
    const payload64 = Buffer.from(payload, 'hex').toString('base64')
    var obj = {payload: payload64, key: bobSharedKey}

  return obj
}

function decrypt(payload64, bobSharedKey){


  const bob_payload = Buffer.from(payload64, 'base64').toString('hex')

  const bob_iv = bob_payload.substr(0,32)
  //minus 32 for IV and 32 for auth tag
  const bob_encrypted = bob_payload.substr(32, bob_payload.length - 32 - 32)
  const bob_auth_tag = bob_payload.substr(bob_payload.length - 32, 32)

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(bobSharedKey, 'hex'), Buffer.from(bob_iv, 'hex'));

    decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'))

    let decrypted = decipher.update(bob_encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    console.table({
      IV: bob_iv,
      decrypted: decrypted,
      auth_tag: bob_auth_tag
    })
    return decrypted

  } catch(error){
    console.log(error.message)
  }

}
