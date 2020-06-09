# Milestone 3

## Brian 
Last week, I implemented a login system using passport.js to redirect users to a Google sign in page. After they log in, they would be redirected to the chat page, which supports multiple users on it at the same time. This week, I will be trying to implement onion routing using multiple encryption schemes on the messages. I anticipate struggling on the server side implementation because I am still unfamiliar with onion routing.


## Kira
Last week, I got started on researching common UI/UX practices for creating a more cybersecure environment for our users to work with. I also started the front-end portion of our app and essentially began making our app “pretty”. I have finished the login screen’s design. This week, I plan to finish the front-end of our app by the time we have our final presentation and project submission. Right now, I’m currently stuck on how to make our chat screen’s design original as well as sleek and easy to use, but I’m actively working through it.

## Jade (Huiyu Wang)
Last week, I implemented the chat room by using the socket.io and other node.js features. After users login to their main page, they could create the chat room and join the chat rooms they want. Since we are going to implement the secure communication channel for the group messaging, this week I plan to see how I could apply the diffie hellman encryption method to the chat room. The problem I stuck on right now is that the algorithm we research on is basically about chatting with two users. I still need to research whether it could encrypt the group messages properly. 

## Emily
Last week, I set up the skeleton for our chat app. This week, I researched and implemented an elliptic curve diffie hellman encryption method. After doing extensive research, I found that the crypto API has a lot of built in functionalities for creating public and private keys, IVs (initialization vectors), authorization tags, and many other necessary tools for implementing end to end encryption. I created encryption and decryption functions in client.js to protect our users’ messages. The problem I am stuck on is that the crypto API doesn’t work on my team members machines. Thus, I want to search for other APIs or other ways to implement diffie hellman. 



[Commits](https://github.com/ECS153/final-project-group-6/commits/master)

[Video](https://youtu.be/_LByY_r0rT4)

[Design Doc](https://docs.google.com/document/d/1bysVvj0Jf-x9zOpvt8dZXXDEAJtxPYfIGJM9DRx5H18/edit?usp=sharing)
