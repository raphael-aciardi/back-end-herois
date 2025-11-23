require('dotenv').config();

const config = {
  port: process.env.PORT_APP || 3000,
  secret: process.env.SECRET || 'default-secret',
  timer: process.env.TIMER || 1562271258,
  processName: process.env.NOME_PROCESSO || 'default-process',
  timeout: 60 * 60 * 1000,
  dbPath: process.env.DB_PATH || './database.db',
};

module.exports = config;
