const db = require('../../classes/mysql');
const requestStatus = require('../../utils/requestStatus');

exports.loginApp = async (req, res) => {
  try {
    const {cpf, senha} = req.body;

    const {results, error} = await db.query(`SELECT * FROM usuarios`);

    if (await db.handleError(error, res, 'Erro ao tentar buscar no banco')) {
      return res.status(requestStatus.OK()).json(results);
    }
  } catch (error) {
    console.log(error);
    return res.status(requestStatus.BAD_REQUEST()).json(error);
  }
};
