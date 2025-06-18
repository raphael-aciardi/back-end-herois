const express = require('express');
const controller = require('./user.controller');
const userRouter = express.Router();

userRouter.post('/create', controller.create);

module.exports = userRouter;
