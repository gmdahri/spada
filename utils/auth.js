var passport = require('passport');
var LocalStrategy = require('passport-local');
const AuthSchema = require('../Models/Auth')
var crypto = require('crypto');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new LocalStrategy(function verify(username, password, cb) {
  AuthSchema.find({  username }).then((user) => {
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    console.log('user', user)
    return cb(null, user);
  }).catch((err) => {
    return cb(err);
  })

}));


passport.use(new GoogleStrategy({
    clientID: "568848388178-4vmsa511u4j4ri5cbtr0nalp6ltm3pfo.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/api/v1/user/login/googlecallback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    const user = await AuthSchema.findOne({ googleId: profile.id })
    if(!user){
      const newUser =await AuthSchema.create({Username: profile.displayName});
      newUser.save();
      return cb(null, newUser)
    }
    return cb(null, user);
  }
));

module.exports = passport;