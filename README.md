# How to run web app
For our group members or anyone who wants to run our code, here is a simple breakdown on how we got started. We will need to download a few things online and via terminal. If something doesn't work on **http://localhost:7777**, be sure to follow the steps on here!

# Getting Started
 - Install [node.js](https://nodejs.org/en/) on local computer.
 - Use a terminal to locate the `webchat` directory. This is where you will run the following commands.
-   run  `npm init`  . This will create a new  `package.json`  file. (it will ask you name/version, etc.). You will need to do this if you don't already have a `package.json`.
-   install dependencies by running:
    -   `npm install --save express`  // a web framework for node
    -   `npm install --save socket.io`  // real-time module for our app
- If you have errors with [express](https://expressjs.com/) or [socket](https://socket.io/docs/), please refer to their websites. 

# Running our Code
 - `cd` into the `webchat` directory on your terminal where `server.js` is located.
 - Run  `node server.js` 
 - Open your favorite terminal to checkout **http://localhost:7777**.
 - You should see the HTML file being served. If not, double check you have all the proper packages and dependencies downloaded :) 
