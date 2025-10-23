const express = require('express');
const controller = require('./user.controller'); // deve estar correto
const userRouter = express.Router();
const authToken = require('../../middlewares/authenticate-jwt');

userRouter.post('/login', controller.loginApp); // agora deve funcionar
userRouter.post('/create', controller.createUser);
userRouter.get('/:id', authToken, controller.userInformation);

module.exports = userRouter;
