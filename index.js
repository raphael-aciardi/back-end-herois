const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/classes/mysql');
const config = require('./src/config/config');
const pm2 = require('pm2');
const router = require('./src/routes');

const app = express();

app.use(
  bodyParser.json({
    limit: '10mb',
  }),
);

app.use(cors());

router(app);

process.on('uncaughtException', err => {
  console.log('uncaughtException : ', err);
  pm2.reload(`${config.processName}`, () => {});
});

app.listen(config.port, () => {
  console.log(`Start, porta ${config.port}`);
  db.connect();
});
