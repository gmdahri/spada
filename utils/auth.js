var passport = require('passport');
var LocalStrategy = require('passport-local');
const AuthSchema = require('../Models/Auth')
var crypto = require('crypto');
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

module.exports = passport;