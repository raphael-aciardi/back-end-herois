const config = {
  port: process.env.PORT_APP, //Porta da aplicação
  secret: process.env.SECRECT, //código que acompanha token
  timer: 1562271258, //
  processName: process.env.NOME_PROCESSO,
  timeout: 60 * 60 * 1000,
};
module.exports = config;
