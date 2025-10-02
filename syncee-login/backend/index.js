const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

console.log('🚀 SERVER STARTING - This should appear when you start the server');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('📨 Incoming request:', req.method, req.path);
  console.log('📦 Body:', req.body);
  console.log('🏷️ Content-Type:', req.headers['content-type']);
  next();
});

// MySQL kapcsolat
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // XAMPP default
  password: '',   // XAMPP default
  database: 'syncee_db'
});

// Regisztráció
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Missing fields');

  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User registered!' });
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Missing fields');

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Incorrect password');

    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });

    res.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || '', // if you have a username column
        created_at: user.created_at  // include the created_at field
      }
    });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));