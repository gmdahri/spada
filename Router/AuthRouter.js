const express = require("express");

const AuthRouter = express.Router();
const passport = require("../utils/auth")
const AuthController = require('../Controller/AuthController');
const { info } = require("winston");

AuthRouter.get('/');
AuthRouter.post('/');
AuthRouter.get('/:id');
AuthRouter.put('/:id');
AuthRouter.delete('/:id');

AuthRouter.post('/login', passport.authenticate('local'), AuthController.loginUser);
AuthRouter.post('/signup', AuthController.signup);
AuthRouter.delete('/logout');

module.exports = AuthRouter;