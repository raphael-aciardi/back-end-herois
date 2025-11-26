require('dotenv').config();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const z = require('zod');

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const loginApp = (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: parseResult.error.issues[0].message,
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

  if (!result.success) {
    return res.status(400).json({
      error: parseResult.error.issues[0].message,
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
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({error: 'Token não enviado'});

  const token = authHeader.split(' ')[1];

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(403).json({error: 'Token inválido ou expirado'});
  }

  // Agora busca o usuário no banco usando o ID do token
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({error: err.message});

    if (!row) return res.status(404).json({error: 'Usuário não encontrado'});

    res.json({data: row});
  });
};

// const refreshToken = (req, res) => {
//   const {token} = req.body;

//   if (!token) return res.status(400).json({error: 'Refresh token ausente'});

//   jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({error: 'Refresh token inválido'});

//     const newAccessToken = jwt.sign({id: decoded.id}, process.env.JWT_SECRET, {
//       expiresIn: '15m',
//     });

//     res.json({accessToken: newAccessToken});
//   });
// };

module.exports = {loginApp, createUser, userInformation};
