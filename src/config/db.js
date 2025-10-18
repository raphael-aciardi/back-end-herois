const sqlite3 = require('sqlite3').verbose();
const config = require('./config'); // ajustado se está em src/config/

console.log('DB Path:', config.dbPath); // <- adicione este log

const db = new sqlite3.Database(config.dbPath, err => {
  if (err) {
    console.error('Erro ao abrir o banco SQLite:', err.message);
  } else {
    console.log(`Conectado ao banco SQLite em: ${config.dbPath}`);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = db;
