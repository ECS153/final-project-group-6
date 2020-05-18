var express = require("express");
var app = express();
var server = require("http").createServer(app);
const io = require("socket.io")(server);


//need to deliver html file easily
app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});

//let express know that all our static (html,css,js) files are in the public dir
app.use(express.static("public"));

io.on("connection", function(client) {
    //success!!!
    console.log("Client connected...");
  
    client.on("join", function(data) {
      console.log(data);
    });

    client.on("messages", function(data) {
        client.emit("thread", data);
        client.broadcast.emit("thread", data);
      });
  });

//open up a port on our localhost hostname
server.listen(7777);