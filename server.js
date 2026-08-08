const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const DATA_FILE = path.join(__dirname, 'pay.json');

app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: 'secure2026', resave: false, saveUninitialized: true }));

function getPay() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(DATA_FILE)); } catch { return []; }
}
function savePay(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }

app.post('/admin-login', (req, res) => {
    if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
        req.session.admin = true; res.json({ success: true });
    } else { res.json({ success: false }); }
});

app.get('/admin-data', (req, res) => {
    if (!req.session.admin) return res.status(401).json([]);
    res.json(getPay());
});

app.post('/approve', (req, res) => {
    if (!req.session.admin) return res.status(401).json({ success: false });
    const data = getPay();
    const user = data.find(u => u.id == req.body.id);
    if (user) { user.status = 'approved'; savePay(data); res.json({ success: true }); }
    else { res.json({ success: false }); }
});

app.post('/save', (req, res) => {
    const data = getPay();
    const newUser = { ...req.body, id: Date.now(), status: 'pending', date: new Date().toLocaleString('en-IN') };
    data.push(newUser); savePay(data);
    res.json({ success: true, id: newUser.id });
});

app.listen(PORT, () => console.log(`Running ${PORT}`));
