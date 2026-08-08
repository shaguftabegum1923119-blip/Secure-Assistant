const express = require('express');
const session = require('express-session');
const path = require('path');

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

// HOMEPAGE - Yaha se index.html khulega
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// PAYMENT PAGE
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'payment.html'))
})

// ADMIN LOGIN PAGE
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// SERVER START - Ye sabse important hai
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
