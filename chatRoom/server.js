if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverWrite = require('method-override');
//for chat
const server = require("http").Server(app);
const io = require('socket.io')(server);


const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

//local variable to store the users
const users = [ {
    id: '1590479990941',
    name: 'a',
    email: 'a@w',
    password: '$2b$10$0M3x1IFc3fYAf5trHqLbJeQcUfsyiklVHNhUnR0XzMSulPs7TGpvi'
},
    {
        id: '1590479997798',
        name: 'b',
        email: 'b@w',
        password: '$2b$10$IN5HNJiVyOUtIWfD0HG92uqmpyb5OYt1umtNvVxuS6brZi0pJv73m'
    },
    {
        id: '1590480007574',
        name: 'c',
        email: 'c@w',
        password: '$2b$10$0dCHmOtQnfr4ZUloRlGukuraJPKAMTsKSChO6Z30Tje3gLk5QLGl.'
    },
    {
        id: '1590480018385',
        name: 'd',
        email: 'd@w',
        password: '$2b$10$XPjeueGA0qeTM.5/daPnXeI6EVUU9x1ybKlG1LP4dZyiq9aP5T4om'
    }
];
const rooms = {};

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverWrite('_method'));
app.use(express.static('public'));


app.get('/',checkAuthenticated,(req,res)=>{
    res.render('index.ejs',{name: req.user.name, rooms: rooms});
});

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
});

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs')
});

app.get('/:room',(req,res) =>{
    if (rooms[req.params.room] == null){
        return res.redirect('/');
    }
    res.render('room',{roomName: req.params.room});
});

app.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/register',async(req,res)=>{
    try{
        const hasedPassword = await bcrypt.hash(req.body.password,10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password:hasedPassword
        });
        res.redirect('/login');

    } catch(e) {
        console.log(e);
        res.redirect('/register');
    }
    console.log(users);
});

app.post('/room',(req,res) =>{
    if(rooms[req.body.room] != null){
        return res.redirect('/');
    }
    rooms[req.body.room] = {users: {}};
    res.redirect(req.body.room);
    //send message that new room was created
    io.emit('room-created', req.body.room);
});
app.post('/back',(req,res)=>{
    return res.redirect('/');
    //res.render('index.ejs',{name: req.user.name, rooms: rooms});
});

app.delete('/logout',(req,res) =>{
    req.logOut();
    res.redirect('/login');
});

io.on('connection', socket => {
    socket.on('new-user', (room, name) => {
        socket.join(room);
        rooms[room].users[socket.id] = name;
        socket.to(room).broadcast.emit('user-connected', name);
    });
    socket.on('send-chat-message', (room, message) => {
        socket.to(room).broadcast.emit('chat-message', {message: message, name: rooms[room].users[socket.id]});
    });
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room =>{
            socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
            delete rooms[room].users[socket.id];
        });

    });
});

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

function getUserRooms(socket){
    return Object.entries(rooms).reduce((names, [name, room]) =>{
        if (room.users[socket.id] != null) names.push(name);
        return names;
    }, [])
}


server.listen(process.env.PORT || 3000, () => console.log('Server has started.'));