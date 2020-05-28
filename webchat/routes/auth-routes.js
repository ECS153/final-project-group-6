const router = require('express').Router();
const passport = require('passport');
const url = require('url');

// login route
router.get('/login', (req, res) => {
  res.render('login');
});

// auth logout
router.get('/logout', (req, res) => {
  // handle with passport
  // res.send("logging out");
  res.render('home');
});


// auth with google
router.get('/google', passport.authenticate('google', {
  scope:['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  /*
  res.redirect(url.format({
     pathname: "/chat",
     query: {
       "user": req.user.displayName
     }
  }));*/
  console.log("GOT HERE IN ROUTER", req.user);
  //res.redirect('/chat')
    res.render('chat',{rooms:{}})
  // res.send();
  // res.render('hello')
});

module.exports = router;
