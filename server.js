const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ===== FINAL LOCKED ADMIN DETAILS - SIRF AAPKE LIYE =====
const ADMIN = {
  name: "Shagufta Ahmed",
  email: "shaguftbegum1923119@gmail.com",
  password: "SA1191923",
  phone: "8465014514",
  upi: "84650119@ybl"
};
// ========================================================

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Security: Session
app.use(session({ 
  secret: 'SA_Super_Secret_Key_119', 
  resave: false, 
  saveUninitialized: false,
  cookie: { secure: false } // Render pe deploy ke baad 'true' kar dena
}));

// Pages
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/admin', (req,res) => res.sendFile(path.join(__dirname,'public','admin.html')));
app.get('/payment', (req,res) => res.sendFile(path.join(__dirname,'public','payment.html')));

// Protected Page
app.get('/dashboard', (req,res) => {
  if(req.session.loggedIn) 
    res.sendFile(path.join(__dirname,'public','dashboard.html'));
  else 
    res.redirect('/admin');
});

// Login Check
app.post('/login', (req,res) => {
  const { email, password } = req.body;
  if(email === ADMIN.email && password === ADMIN.password){
    req.session.loggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send("<script>alert('Galat Email ya Password');window.location='/admin'</script>");
  }
});

// Logout
app.get('/logout', (req,res) => { 
  req.session.destroy(); 
  res.redirect('/'); 
});

app.listen(PORT, () => console.log(`Secure Assistant running on port ${PORT}`));
