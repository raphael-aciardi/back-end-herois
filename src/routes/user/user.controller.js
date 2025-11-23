require('dotenv').config();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginApp = (req, res) => {
  const {email, password} = req.body;

  if (!email) return res.status(400).json({error: 'Email é obrigatório'});

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Usuário não encontrado'});

    if (!bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({error: 'Senha incorreta'});
    }

    const token = jwt.sign({id: row.id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({data: row, jwt: token});
  });
};

const createUser = (req, res) => {
  const {name, email, password} = req.body;

  if (!name) return res.status(400).json({error: 'Name is required'});
  if (!email) return res.status(400).json({error: 'Email is required'});
  if (!password) return res.status(400).json({error: 'Password is required'});

  const passwordHash = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, passwordHash],
    function (err) {
      if (err) return res.status(500).json({error: err.message});
      res.status(201).json({id: this.lastID});
    },
  );
};

const userInformation = (req, res) => {
  const {id} = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Usuário nao encontrado'});
    res.json({data: row});
  });
};

module.exports = {loginApp, createUser, userInformation};
