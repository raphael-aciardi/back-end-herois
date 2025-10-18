const db = require('../../config/db');

const loginApp = (req, res) => {
  const {email} = req.body;

  console.log('bateu');

  if (!email) return res.status(400).json({error: 'Email é obrigatório'});

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Usuário não encontrado'});

    res.json({data: row});
  });
};

const createUser = (req, res) => {
  const {name, email, password} = req.body;

  if (!name) return res.status(400).json({error: 'Name is required'});
  if (!email) return res.status(400).json({error: 'Email is required'});
  if (!password) return res.status(400).json({error: 'Password is required'});

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    function (err) {
      if (err) return res.status(500).json({error: err.message});
      res.status(201).json({id: this.lastID});
    },
  );
};

module.exports = {loginApp, createUser};
