const db = require('../../classes/mysql');

exports.getAll = async (req, res) => {
  try {
    let {page} = req.query;
    page = parseInt(page) || 1;
    const limit = 10;

    const offset = (page - 1) * limit;

    const countResponse = await db.query(
      'SELECT COUNT(raking_id) AS scheduleCount FROM ranking',
    );

    console.log('Fetching ranking data');

    const {results, error} = await db.query(
      `
        SELECT
            us.id_user,
            us.image_url,
            us.country_image,
            us.name, 
            rk.words,
            rk.points,
            ROW_NUMBER() OVER (ORDER BY rk.points DESC) AS position
        FROM ranking rk
        LEFT JOIN users us ON us.id_user = rk.user_id
        ORDER BY rk.points DESC
        LIMIT ? OFFSET ?;
      `,
      [limit, offset],
    );

    const scheduleCount = countResponse.results[0].scheduleCount;
    const lastPage = Math.ceil(scheduleCount / limit);

    const pagination = {
      current_page: page,
      prev_page: page > 1 ? page - 1 : null,
      next_page: page < lastPage ? page + 1 : null,
      last_page: lastPage,
      total: scheduleCount,
    };

    if (error) {
      return db.handleError(error, res, 'Error fetching ranking data');
    }

    return res.status(200).json({
      results,
      pagination,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.getById = async (req, res) => {
  const {user} = req.headers;

  try {
    const {results, error} = await db.query(
      'SELECT * FROM ranking WHERE user_id = ?',
      [user],
    );

    if (error) {
      return db.handleError(error, res, 'Error fetching ranking data');
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.put = async (req, res) => {
  try {
    const {user} = req.headers;
    const {points} = req.body;

    const {results, error} = await db.query(
      'UPDATE ranking SET words = words + 1,points=points + ? WHERE user_id = ?',
      [points, user],
    );

    if (error) {
      return db.handleError(error, res, 'Error fetching ranking data');
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
