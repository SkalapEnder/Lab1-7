const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Route to display the registration form
router.get('/register', (req, res) => {
    res.render('registration');
});

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { user_name, email, password, birthdate, gender } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.send('User already exists!');
    }

    // Create a new user
    const newUser = new User({
        user_name,
        email,
        password,
        birthdate,
        gender,
    });

    // Hash the password before saving
    await newUser.save();
    res.redirect('/login');
});

// Route to display the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { user_name, password } = req.body;
    const user = await User.findOne({ user_name });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.send('Invalid login credentials');
    }

    req.session.userId = user._id; // Store user session
    res.redirect('/index'); // Redirect to the main page after login
});

// Route to handle logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});

module.exports = router;
