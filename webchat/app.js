const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const app = express();
var server = require("http").createServer(app);
const io = require("socket.io")(server);
const passportSetup = require('./config/passport-setup');
const passport = require('passport')

app.set('views','./views');
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static('public'));
//app.use(express.static("public"));
// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(express.urlencoded({ extended: true }))


// home route
app.get('/', (req, res) => {
  res.render('home');

});

const users = {}
var connectedFlag = 0
const rooms = {  }


app.get('/chat', (req, res) =>{
  //app.use(express.static("public"));
  res.render('chat',{rooms: rooms});
});

app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
      return res.redirect('/chat')
    }
    res.render('room', {roomName: req.params.room, members: rooms[req.params.room].users})
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/chat')
  }
  rooms[req.body.room] = { users: {} }
  // res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

//function ioConnect() {
  io.on('connection', socket => {
    socket.on('new-user',(room, name) => {
      socket.join(room)
      rooms[room].users[socket.id] = name
      socket.to(room).broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message',(room, message)=> {
        socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
        socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
        delete rooms[room].users[socket.id]
      })
    })
  })
//}

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}

server.listen(8008, () =>{
  console.log('listening on port 8008');

});
