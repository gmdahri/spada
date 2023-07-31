var passport = require('passport');
var LocalStrategy = require('passport-local');
const AuthSchema = require('../Models/Auth')
var crypto = require('crypto');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook')
require("dotenv").config();


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
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:5000/api/v1/user/login/googlecallback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    const user = await AuthSchema.findOne({ googleId: profile.id })
    if(!user){
      const newUser =await AuthSchema.create({Username: profile.displayName, googleId: profile.id});
      newUser.save();
      return cb(null, newUser)
    }
    return cb(null, user);
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "http://localhost:5000/api/v1/user/auth/facebook/callback/",
},
async function(accessToken, refreshToken, profile, cb) {
  console.log("profile,", profile)
  const user = await AuthSchema.findOne({ facebookId: profile.id })
  if(!user){
    const newUser =await AuthSchema.create({Username: profile.displayName, facebookId: profile.id});
    newUser.save();
    return cb(null, newUser)
  }
  return cb(null, user);
}
));

module.exports = passport;