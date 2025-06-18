const express = require('express');
const controller = require('./ranking.controller');
const rankingRouter = express.Router();

rankingRouter.get('/getAll', controller.getAll);
rankingRouter.get('/getById', controller.getById);
rankingRouter.put('/put', controller.put);

module.exports = rankingRouter;
