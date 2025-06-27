const express = require('express');
const controller = require('./user.controller');
const userRouter = express.Router();

userRouter.post('/login', controller.loginApp);

module.exports = userRouter;
