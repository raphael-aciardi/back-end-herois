const express = require('express');
const {loginApp} = require('./user.controller');
const userRouter = express.Router();

userRouter.post('/login', loginApp);

export default userRouter;
