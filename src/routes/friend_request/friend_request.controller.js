const db = require('../../classes/mysql');

exports.friendRequest = async (req, res) => {
  try {
    const {user_id, email} = req.body;

    const {results, error: selectError} = await db.query(
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
    if (selectError)
      if (selectError) {
        return db.handleError(selectError, res, 'Error fetching ranking data');
      }

    const friend_id = results[0].friend_id;

    const {results: insertResult, error: insertError} = await db.query(
      `
      INSERT INTO friendship (user_id, friend_id, status)
        SELECT ${user_id}, ${results[0].friend_id}, 1
      WHERE NOT EXISTS (
        SELECT 1
        FROM friendship
        WHERE (${user_id} AND ${friend_id})
          OR (${friend_id} AND ${user_id})
      );
      `,
    );

    if (insertError)
      if (insertError) {
        return db.handleError(insertError, res, 'Error fetching ranking data');
      }

    return res.status(200).json({
      insertResult,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
