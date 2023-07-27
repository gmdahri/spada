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
AuthRouter.post('/signup', AuthController.signup);
AuthRouter.delete('/logout');

module.exports = AuthRouter;