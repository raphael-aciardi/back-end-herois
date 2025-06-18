const db = require('../../classes/mysql');
const requestStatus = require('../../utils/requestStatus');

exports.create = async (req, res) => {
  try {
    const {nome, email, image, uid, provider, messageToken, platform} =
      req.body;

    const body = {nome, email, image, uid, provider, messageToken, platform};

    const {results: selectResult, error: selectError} = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (selectError) {
      return db.handleError(
        selectError,
        res,
        'Erro ao verificar usuário existente',
      );
    }

    if (selectResult.length === 0) {
      console.log('Inserindo novo usuário');

      const {results: insertResult, error: insertError} = await db.query(
        'INSERT INTO users (uid, provider, messageToken, platform, email, name, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uid, provider, messageToken, platform, email, nome, image],
      );

      if (insertError) {
        return db.handleError(insertError, res, 'Erro ao inserir usuário');
      }

      const {results: insertRanking, error: rankingError} = await db.query(
        'INSERT INTO ranking(words, points, user_id) VALUES (? , ?, ?)',
        [1, 50, insertResult.insertId],
      );

      if (rankingError) {
        return db.handleError(error, res, 'Error fetching ranking data');
      }

      console.log('Inserido');

      console.log('Usuário criado com ID:', insertResult.insertId);

      return res.status(requestStatus.OK()).json({
        message: 'Usuário criado com sucesso',
        data: {...body, id: insertResult.insertId},
      });
    }

    return res.status(requestStatus.OK()).json({
      message: 'Usuário já cadastrado',
      data: selectResult[0],
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return res.status(requestStatus.BAD_REQUEST()).json({
      error: 'Erro inesperado ao processar usuário',
      details: error.message,
    });
  }
};
