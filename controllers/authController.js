// authcontroller.js
const db = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

// User registration logic
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists. Please proceed to login.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 15);

        // Insert user into the database
        await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name,
            email,
            hashedPassword
        ]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};