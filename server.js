const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// ADMIN login - Render ke Environment se lega, nahi mila to secrets.json se
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || require('./secrets.json').ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || require('./secrets.json').ADMIN_PASSWORD;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secureassistantsecret',
  resave: false,
  saveUninitialized: false
}));

// Login page
app.get('/admin', (req, res) => {
  if (req.session.isAdmin) {
    return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  }
  res.send(`
    <form method="POST" style="text-align:center; margin-top:100px;">
      <h2>Admin Login</h2>
      <input name="username" placeholder="Username" required><br><br>
      <input name="password" type="password" placeholder="Password" required><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Login check
app.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.send('Wrong username or password. <a href="/admin">Try again</a>');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
});

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
