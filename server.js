const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Render se username aur password yaha aayega
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Public folder ko enable karo
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Login session
app.use(session({
  secret: 'secureassistantsecretkey123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Admin login page
app.get('/admin', (req, res) => {app.get('/', (req, res) => {
  res.send('Hello Di! Site Live hai 🎉')
})
  if (req.session.isAdmin) {
    return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  }
  res.send(`
    <div style="text-align:center; margin-top:100px; font-family:Arial;">
      <h2>Admin Login</h2>
      <form method="POST">
        <input name="username" placeholder="Username" required style="padding:10px; margin:5px;"><br>
        <input name="password" type="password" placeholder="Password" required style="padding:10px; margin:5px;"><br>
        <button type="submit" style="padding:10px 20px; margin-top:10px;">Login</button>
      </form>
    </div>
  `);
});

// Login check
app.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.send('Wrong Login. <a href="/admin">Try again</a>');
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
