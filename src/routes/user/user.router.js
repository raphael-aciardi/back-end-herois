const express = require('express');
const controller = require('./user.controller'); // deve estar correto
const userRouter = express.Router();

userRouter.post('/login', controller.loginApp); // agora deve funcionar

module.exports = userRouter;
