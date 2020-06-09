# speakEZ
Authors: Brian, Emily, Jade (Huiyu), and Kira

## What is speakEZ
  We built a simple messaging web app that supports group messaging and implements encryption using Diffie Hellman.

## Running our code

1. `cd` into the `webchat` directory on your terminal where `server.js` is located.
2. `sudo npm install -g --force nodemon`

3.  `npm install ejs express passport passport-google-oauth20 socket.io url`

4. `nodemon app.js`

5. Open http://localhost:8008 on your favorite browser (can open multiple tabs with this same link for multiple users)

  
  

# File Structure
Notice that the admin folder holds our documentation such as our milestone meetings and design docs. The webchat folder is where our code resides. Below is our file structure within webchat.

Server.js

 - sets up Google auth passport

View: chat.ejs, home.ejs, room.ejs

 - these ejs files correspond to html files that represent the layout of our chat page, home page, and room page

Routes: auth-routes.js, profile-routes.js

 - sets up auth logins with Google and logouts

Public: client.js and bundle.js

 - client.js 
	 - where we use the socket API to append messages to the screen such as "user connected" and the user's actual messages
	 - this is also where the encryption occurs using the crypto API to implement Diffie Hellman 
 - bundle.js
	 - the result of browserify client.js
	 - browserify lets you `require('modules')` in the browser by bundling up all of your dependencies

public/asset: chat.css home.css room.css

 - style sheets for chat, home, and room pages
 
Flow:

 - login/register google account (home.ejs)
 - transition page to select room to chat (chat.ejs)
 - chat room where any number of users can message each other (room.ejs)


# How our project works
We really wanted to focus on two key aspects for our project: having multiple users chatting and implementing Diffie Hellman. As mentioned above in our file structure, this occurs in webchat/public/client.js

## Chatting with multiple users
We used [socket.io](https://socket.io/) to accomplish this. Sockets enable the server to push messages to clients. When a user writes a chat message, the server could get it and push it to all other connected users. In order to establish a connection, Socket.IO has two parts. The first part is that a server integrates with the Node.JS HTTP Server socket.io The second part is a client library that loads on the browser side socket.io-client. After the connection, we need to send the chat messages in the chat room. This is accomplished by the broadcasting mechanism, emitting the events from the server to the rest of the users. On the server side, we will first define the event of “chat message”, and broadcast the message to all the connected users using the broadcast flag in socket. On the client side, we could capture a chat message event and pass it to the page.

## Implementing Diffie Hellman
We implemented Diffie Hellman using the [crypto API](https://nodejs.org/api/crypto.html#crypto_class_diffiehellman). In client.js, we created an encrypt and decrypt function. 

### Encrypt:

First, we want to create these two parties that will send encrypted messages to each other. For the purposes of our app, Alice is the first user that enters the chatroom and Bob is any user that enters the room after. Here we create one key to encrypt all group chat messages. In decrypt, we send that key to each of the different members. Back to Alice and Bob, we want to generate their keys, their public keys, and then compute their shared key. Then we create an IV which is an initialization vector. An IV is like the salt of encryption. It should be public and random, and it should be used one time per message

    const  cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(aliceSharedKey, 'hex'), IV)

Here, we create a cipher using aes-256-gcm, a buffer from Alice's shared key, and the IV we just generated. Now what does aes-256-gcm mean? AES is a symmetric encryption algorithm, and we are supporting it with a block length of 256 bits. 

GCM means Galois/ counter mode. GCM allows us to send authenticated messages. Now, the security that comes with using GCM is confidentiality, integrity, and authenticity. Confidentiality means that without the key, no one can read the message. Integrity means that no one had changed the content of the message. Authenticity means that the originator of the message can be verified.   

Now, we use the cipher to update the encrypted message. As you can see in the screenshot below, the encrypted message is a random string. 

Next, we need to create the payload. In cryptography, I learned that the payload is IV + encrypted message + authentication tag. At the end of the function, we return the payload in base 64 (since that is the base we decided to use) and Bob's shared secret.

    //payload = IV + encrypted + auth tag
    
    const  payload = IV.toString('hex') + encrypted + auth_tag

![](https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/s2048x2048/101631387_259445015119792_6536645244299609422_n.png?_nc_cat=102&_nc_sid=b96e70&_nc_ohc=TJG9EyBEfEsAX8CGRbS&_nc_ht=scontent-sjc3-1.xx&oh=60629a3af3a2d0859b33e715df8fa7b4&oe=5F068848)
Here is a screenshot showing the encrypted and decrypted messages sent across users. You can access this console log by right clicking on the broswer at localhost, clicking inspect, and the selecting console. 


### Decrypt:
In decrypt, we need the payload and Bob's shared key in order to decipher the original message. Here, we create Bob's payload from the payload in the argument. Then, we can work backwards to extract Bob's IV which is the first 32 bits of the payload, Bob's encrypted message which is in between index 32 and the payload length minus the length of the IV and the auth tag, and finally Bob's auth tag which is the rest of the payload. 

Lastly, we created the decipher and from that we created the decrypted message and returned it. If there was an error, we catch it. 

# Slides and Demo
[Final presentation slides](https://docs.google.com/presentation/d/11Ijn67_xjzsUHDNGjqXtVnReOkCsmb02yFPN1VIqeTU/edit?usp=sharing)

[Demo](https://www.youtube.com/watch?v=2IsJuNSSQh8&feature=youtu.be)!
