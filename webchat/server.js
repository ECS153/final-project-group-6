const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: '406835155993-hu6tqvs1gf1h6vg8ahr87njdpumk4ql2.apps.googleusercontent.com',
    clientSecret: '53v3W3Fb5axgp7IQdgnqULOe'
  }, () => {

  })
)
