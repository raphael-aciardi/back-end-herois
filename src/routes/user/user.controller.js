require('dotenv').config();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const z = require('zod');

const loginApp = (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
  });

  if (!parseResult.success) {
    return res.status(400).json({
      error: parseResult.error.errors[0].message,
    });
  }

  const {email, password} = parseResult.data;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({error: 'Usuário não encontrado'});

    const passwordMatch = bcrypt.compareSync(password, row.password);

    if (!passwordMatch) {
      return res.status(401).json({error: 'Senha incorreta'});
    }

    const token = jwt.sign({id: row.id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({success: true, jwt: token});
  });
};

const createUser = (req, res) => {
  const result = createUserSchema.safeParse(req.body);

  const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors[0].message,
    });
  }

  const {name, email, password} = result.data;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({error: err.message});

    if (row) {
      return res.status(400).json({error: 'Email already exists'});
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, passwordHash],
      function (err) {
        if (err) return res.status(500).json({error: err.message});

        const token = jwt.sign({id: this.lastID}, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        res.json({success: true, jwt: token});
      },
    );
  });
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
