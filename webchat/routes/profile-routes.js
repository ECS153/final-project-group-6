const router = require('express').Router()

router.get('/', (req, res) => {
  console.log("profile route", req.query.user)
  res.render('chat')
  // res.send('You are logged in. This is your profile - ' + req.query.user)

});

module.exports = router;
