const express = require('express');
const controller = require('./user.controller');
const userRouter = express.Router();
const authToken = require('../../middlewares/authenticate-jwt');

userRouter.post('/login', controller.loginApp);
userRouter.post('/create', controller.createUser);
userRouter.get('/:id', authToken, controller.userInformation);

module.exports = userRouter;
