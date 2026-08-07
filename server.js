const express = require('express');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secure_assistant_secret_123',
  resave: false,
  saveUninitialized: false
}));

// Database setup
const db = new sqlite3.Database('./payments.db');
db.run(`CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan TEXT,
  amount INTEGER,
  customer_name TEXT,
  transaction_id TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Admin credentials
const ADMIN_USER = "Shaguftaahmed";
const ADMIN_PASS = "SA1191923";

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if(username === ADMIN_USER && password === ADMIN_PASS){
    req.session.loggedin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.send('Galat password! <a href="/admin">Wapas jao</a>');
  }
});

app.get('/admin/dashboard', (req, res) => {
  if(req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/admin');
  }
});

// API for dashboard data
app.get('/api/stats', (req, res) => {
  db.all("SELECT * FROM payments", [], (err, rows) => {
    let total = rows.reduce((sum, r) => sum + r.amount, 0);
    res.json({total, payments: rows});
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
