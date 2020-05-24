const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const app = express();
var server = require("http").createServer(app);
const io = require("socket.io")(server);
const passportSetup = require('./config/passport-setup');
const passport = require('passport')


app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


// home route
app.get('/', (req, res) => {
  res.render('home');

});

const users = {}
var connectedFlag = 0



app.get('/chat', (req, res) =>{
  app.use(express.static("public"));
  res.render('chat');
  if (connectedFlag == 0) {
    ioConnect();
    connectedFlag = 1;
  }
});


function ioConnect() {
  io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  })
}

server.listen(8008, () =>{
  console.log('listening on port 8008');

});
