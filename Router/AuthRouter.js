const express = require("express");

const AuthRouter = express.Router();
const passport = require("../utils/auth")
const AuthController = require('../Controller/AuthController');
const { info } = require("winston");

AuthRouter.get('/', AuthController.getAllUsers);
AuthRouter.post('/', AuthController.createUser);
AuthRouter.get('/:id', AuthController.getAllUsers);
AuthRouter.put('/:id', AuthController.updateUserById);
AuthRouter.put('/assignrole/:id', AuthController.AssignRole);
AuthRouter.delete('/:id', AuthController.deleteUserById);


AuthRouter.post('/login', passport.authenticate('local'), AuthController.loginUser);
AuthRouter.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));
AuthRouter.get('/login/googlecallback', passport.authenticate('google', { failureRedirect: '/api/v1/user/login' }),
  function (req, res) {
    res.json({ message: "SuccessFully Logged in..", susccess: true })
  });
AuthRouter.post('/signup', AuthController.signup);

AuthRouter.get('/auth/facebook',
  passport.authenticate('facebook'));

AuthRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/api/v1/user/auth/facebook' }),
  function (req, res) {
    res.json({ message: "SuccessFully Logged in..", susccess: true })

  });
AuthRouter.delete('/logout');

module.exports = AuthRouter;