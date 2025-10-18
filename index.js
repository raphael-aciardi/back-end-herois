require('dotenv').config(); // carrega variáveis do .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pm2 = require('pm2');
const config = require('./src/config/config');
const router = require('./src/routes');
const db = require('./src/config/db'); // ✅ nova importação (SQLite)

const app = express();

// Middleware para JSON
app.use(
  bodyParser.json({
    limit: '10mb',
  }),
);

// Middleware para CORS
app.use(cors());

// Rotas
router(app);

// Captura erros não tratados
process.on('uncaughtException', err => {
  console.error('uncaughtException:', err);
  pm2.reload(`${config.processName}`, () => {});
});

// Inicia o servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor iniciado na porta ${config.port}`);
  console.log('📦 Banco de dados SQLite carregado com sucesso.');
});
