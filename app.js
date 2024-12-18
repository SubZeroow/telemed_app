// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patientRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes'); // Make sure this is imported correctly
require('dotenv').config();
const setupDatabase = require('./setupDatabase');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('views'));

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: true,
}));

const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', isAuthenticated, patientRoutes);
app.use('/api/doctors', doctorsRoutes); // Ensure this is set up correctly

app.get('/patient', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'patient.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});