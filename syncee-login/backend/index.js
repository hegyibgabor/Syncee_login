const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

console.log('🚀 SERVER STARTING - This should appear when you start the server');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Nyilván így nem tárolunk semmilyen jelszót és érzékeny információt.
// Érdemes secret server-ről vagy cloud library-ből. 
const db = mysql.createConnection({
  host: 'dpg-d3f6n7ffte5s73bnt1t0-a',
  user: 'testuser',
  password: 'Kwl54xEuJZONM1VY4MFd9sVQunDlfQLm',
  database: 'syncee_db'
});

// ---------------- REGULAR REGISTER ----------------
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ error: 'Missing fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send({ error: 'Database error' });

    if (results.length > 0) {
      return res.status(400).send({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).send({ error: 'Database error' });
        res.send({ message: 'User registered!' });
      }
    );
  });
});

// ---------------- REGULAR LOGIN ----------------
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
        username: user.username || '',
        created_at: user.created_at
      }
    });
  });
});

// És így sem tárolunk semmit.
passport.use(new GoogleStrategy({
  clientID: '1027750034563-oq9brejplo2vgs6c6d1jrsp6n9pvo7ir.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return done(err);

    if (results.length > 0) {
      return done(null, results[0]);
    } else {
      db.query(
        'INSERT INTO users (email, google_id, username) VALUES (?, ?, ?)',
        [email, profile.id, profile.displayName],
        (err, result) => {
          if (err) return done(err);
          return done(null, {
            id: result.insertId,
            email,
            username: profile.displayName
          });
        }
      );
    }
  });
}));

// ---------------- GOOGLE ROUTES ----------------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });

    res.redirect(
      `http://localhost:4200/login-success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);
app.listen(3000, () => console.log('✅ Server running on port 3000'));
