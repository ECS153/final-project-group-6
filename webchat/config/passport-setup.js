const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
var prof;



passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: '406835155993-hu6tqvs1gf1h6vg8ahr87njdpumk4ql2.apps.googleusercontent.com',
    clientSecret: '53v3W3Fb5axgp7IQdgnqULOe'
  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log(profile)
    prof = profile
    console.log("passport callback function fired");
    done(null, profile);
  })
)

passport.serializeUser((profile, done) => {
    console.log("GOT HERE SERIALIZE");
    done(null, profile);
});

passport.deserializeUser((profile, done) => {
    console.log("DESERIALIZEUSER");
    done(null, profile);
});
