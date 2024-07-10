const configDb = {
  connectionLimit: 5,
  host: process.env.HOST, // O host do banco. Ex: localhost
  user: process.env.USER_DATABASE, // Um usuário do banco. Ex: user
  password: process.env.PASSWORD_DATABASE, // A senha do usuário. Ex: user123
  database: process.env.DATABASE, // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
};
module.exports = configDb;
