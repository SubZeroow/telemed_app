const express = require('express'); 
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');
const User = require('../models/userModel');

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender, address } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            first_name,
            last_name,
            email,
            password_hash: hashedPassword,
            phone: phone || null,
            date_of_birth: dob || null,
            gender: gender || null,
            address: address || null,
        });

        await newUser.save();

        // Log registration success to the console
        console.log(`User registered successfully: ${first_name} ${last_name}, Email: ${email}`);

        // Send success response with user's first name
        return res.status(201).json({ first_name });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user.' });
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Log login success to the console
        console.log(`User logged in successfully: ${user.first_name} ${user.last_name}`);

        // Store user information in session (optional)
        req.session.userId = user.id; // Store user ID or any other info

        // Send success response with user's first name
        return res.status(200).json({ first_name: user.first_name });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Error logging in user.' });
    }
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out user:', err);
            return res.status(500).json({ message: 'Error logging out user.' });
        }
        
        // Redirect to the index.html page
        res.sendFile(path.join(__dirname, '../views', 'index.html'));
    });
});

// Export the router
module.exports = router;