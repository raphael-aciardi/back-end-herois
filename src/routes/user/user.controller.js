const db = require('../../config/db');

const loginApp = (req, res) => {
  const {email} = req.body;
  if (!email) return res.status(400).json({error: 'Email é obrigatório'});

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Usuário não encontrado'});

    res.json({data: row});
  });
};

module.exports = {loginApp};
