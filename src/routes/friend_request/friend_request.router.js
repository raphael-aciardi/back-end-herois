const express = require('express');
const controller = require('./friend_request.controller');
const friendRequestRouter = express.Router();

friendRequestRouter.post('/friendRequest', controller.friendRequest);

module.exports = friendRequestRouter;
