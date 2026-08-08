const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// AAPKA DATA
const ADMIN_USER = "admin";
const ADMIN_PASS = "SA1191923";
const ADMIN_WA = "918465014514";

app.use(express.json());
app.use(express.static('public'));
app.use(session({secret: 'securekey123', resave: false, saveUninitialized: false}));

const getPay = () => fs.existsSync('payments.json') ? JSON.parse(fs.readFileSync('payments.json')) : [];
const savePay = (d) => fs.writeFileSync('payments.json', JSON.stringify(d));

// Payment Submit
app.post('/submit-payment', (req, res) => {
    let payments = getPay();
    payments.push({...req.body, time: new Date().toLocaleString()});
    savePay(payments);
    let msg = `🔔 NEW: ₹${req.body.amount} Txn:${req.body.txn}`;
    res.json({link: `https://wa.me/${ADMIN_WA}?text=${msg}`});
});

// Admin Login
app.post('/admin-login', (req, res) => {
    if(req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS){
        req.session.admin = true;
        res.json({ok: true, data: getPay()});
    } else res.status(401).json({ok: false});
});

// Admin Data
app.get('/admin-data', (req, res) => {
    if(req.session.admin) res.json(getPay());
    else res.status(401).json([]);
});

// Approve
app.post('/approve', (req, res) => {
    savePay(getPay().filter(p => p.txn !== req.body.txn));
    res.json({ok: true});
});

app.listen(PORT);
