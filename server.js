const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// AAPKE RENDER KE NAAM SE HI UTHA RAHA HAI
const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const UPI_ID = process.env.UPI;
const WHATSAPP_NUM = process.env.WHATSAPP;

const DATA_FILE = path.join(__dirname, 'pay.json');

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'secure-assistant-secret-key-2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 din
}));

// PAY.JSON READ
function getPay() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    } catch {
        return [];
    }
}

// PAY.JSON WRITE
function savePay(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ADMIN LOGIN API
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.admin = true;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Galat username ya password" });
    }
});

// ADMIN PANEL DATA LANA
app.get('/admin-data', (req, res) => {
    if (!req.session.admin) return res.status(401).json([]);
    res.json(getPay());
});

// APPROVE BUTTON
app.post('/approve', (req, res) => {
    if (!req.session.admin) return res.status(401).json({ success: false });
    const { id } = req.body;
    const data = getPay();
    const user = data.find(u => u.id === id);
    if (user) {
        user.status = 'approved';
        savePay(data);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// USER FORM SAVE KARNA
app.post('/save', (req, res) => {
    const data = getPay();
    const newUser = { 
        ...req.body, 
        id: Date.now(), 
        status: 'pending',
        date: new Date().toLocaleString('en-IN')
    };
    data.push(newUser);
    savePay(data);
    res.json({ success: true, id: newUser.id });
});

// HEALTH CHECK
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => console.log(`Server running fast on ${PORT}`));
