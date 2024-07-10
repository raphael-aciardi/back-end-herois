// importação de bibliotecas
// -----------------------------------------------------------------------------
const mysql = require('mysql');
const config = require('../config/db');
const RequestStatus = require('../utils/requestStatus');
// -----------------------------------------------------------------------------

// Código principal
// -----------------------------------------------------------------------------

class db {
  constructor() {
    this.connection = mysql.createPool(config);
  }

  //Conecta com o banco
  async connect() {
    this.connection.getConnection(function (err, connection) {
      if (err) throw err;
      console.log('Connected to MySql');
    });
  }

  //Realiza query
  async query(query, params = []) {
    try {
      return new Promise(resolve => {
        this.connection.query(query, params, (error, results, fields) =>
          resolve({error, results, fields}),
        );
      });
    } catch (error) {
      console.log('Error during database query: ', error);
      return {error: null, results: [], fields: undefined};
    }
  }

  //Realiza cuida dos erros
  async handleError(error, res, errorMsg = 'Erro ao conectar no banco') {
    if (error) {
      console.log(error);
      res
        .status(RequestStatus.BAD_REQUEST())
        .json({message: errorMsg, error: error});
      if (error.fatal) {
        await this.connect();
      }
      return false;
    } else {
      return true;
    }
  }
}
module.exports = new db();
