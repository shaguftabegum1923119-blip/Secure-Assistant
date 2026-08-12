const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Sab files ko public karega
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Admin login
app.post('/admin-login', express.json(), (req, res) => {
  const { email, password } = req.body;
  if(email === "shaguftbegum1923119@gmail.com" && password === "SA1191923"){
    res.json({success: true});
  } else {
    res.json({success: false});
  }
});

app.listen(PORT, () => console.log(`Server chal gaya ${PORT} pe`));
