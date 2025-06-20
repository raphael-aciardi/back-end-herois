const db = require('../../classes/mysql');

exports.friendRequest = async (req, res) => {
  try {
    const {email} = req.body;
    const {user} = req.headers;

    const {results: UserByEmailResults, error: errorUserByEmail} =
      await db.query(
        `
        SELECT 
          id_user AS friend_id 
        FROM 
          users  
        WHERE 
          email = ?
      `,

        [email],
      );
    if (errorUserByEmail)
      if (errorUserByEmail) {
        return db.handleError(
          errorUserByEmail,
          res,
          'Erro ao consultar usuário por email',
        );
      }

    if (!UserByEmailResults || UserByEmailResults.length === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado com esse e-mail.',
        success: false,
      });
    }

    const {results: insertResult, error: insertError} = await db.query(
      `
      INSERT INTO friendship (user_id, friend_id, status)
        SELECT ${user}, ${UserByEmailResults[0].friend_id}, 1
        WHERE NOT EXISTS (
          SELECT 1
            FROM friendship
            WHERE (user_id = ${user} AND friend_id = ${UserByEmailResults[0].friend_id})
              OR (user_id = ${UserByEmailResults[0].friend_id} AND friend_id = ${user})
        );

      `,
    );

    let inserted =
      insertResult.affectedRows > 0 ? 'Foi inserido' : 'Não foi inserido';

    if (insertError)
      if (insertError) {
        return db.handleError(insertError, res, 'Não foi possível inserir');
      }

    return res.status(200).json({
      inserted,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getRequests = async (req, res) => {
  const {user} = req.headers;
  try {
    const {results, error} = await db.query(
      `
      SELECT
          us.id_user,
          us.country_image,
          us.image_url,
          us.name,
          ROW_NUMBER() OVER(
      ORDER BY
          rk.points
          DESC
          ) AS position,
          rk.words,
          rk.points
      FROM
          friendship fd
      LEFT JOIN users us ON
          fd.friend_id = us.id_user
      LEFT JOIN ranking rk ON
          fd.friend_id = rk.user_id
      WHERE
          fd.friend_id = ? AND fd.status = 1
      `,
      [user],
    );

    if (error) {
      return db.handleError(error, res, 'Erro ao consultar usuário por email');
    }
    return res.status(200).json({
      data: results,
      success: true,
    });
  } catch {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.getFriends = async (req, res) => {
  const {user} = req.headers;
  try {
    const {results, error} = await db.query(
      `
      SELECT
          us.id_user,
          us.country_image,
          us.image_url,
          us.name,
          ROW_NUMBER() OVER(
      ORDER BY
          rk.points
          DESC
          ) AS position,
          rk.words,
          rk.points
      FROM
          friendship fd
      LEFT JOIN users us ON
          fd.friend_id = us.id_user
      LEFT JOIN ranking rk ON
          fd.friend_id = rk.user_id
      WHERE
          fd.user_id = ? AND fd.status = 2
      `,
      [user],
    );

    if (error) {
      return db.handleError(error, res, 'Erro ao consultar usuário por email');
    }
    return res.status(200).json({
      data: results,
      success: true,
    });
  } catch {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.getSends = async (req, res) => {
  const {user} = req.headers;
  try {
    const {results, error} = await db.query(
      `
      SELECT
          us.id_user,
          us.country_image,
          us.image_url,
          us.name,
          ROW_NUMBER() OVER(
      ORDER BY
          rk.points
          DESC
          ) AS position,
          rk.words,
          rk.points
      FROM
          friendship fd
      LEFT JOIN users us ON
          fd.friend_id = us.id_user
      LEFT JOIN ranking rk ON
          fd.friend_id = rk.user_id
      WHERE
          fd.user_id = ? AND fd.status = 1
      `,
      [user],
    );

    if (error) {
      return db.handleError(error, res, 'Erro ao consultar usuário por email');
    }
    return res.status(200).json({
      data: results,
      success: true,
    });
  } catch {
    console.log(error);
    return res.status(400).json(error);
  }
};
