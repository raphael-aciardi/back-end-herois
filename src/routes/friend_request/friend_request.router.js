const express = require('express');
const controller = require('./friend_request.controller');
const friendRequestRouter = express.Router();

friendRequestRouter.post('/friendRequest', controller.friendRequest);
friendRequestRouter.get('/getFriends', controller.getFriends);
friendRequestRouter.get('/getRequests', controller.getRequests);
friendRequestRouter.get('/getSends', controller.getSends);

module.exports = friendRequestRouter;
