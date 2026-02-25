const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Mongoose model

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if student already exists
        const existing = await Student.findOne({ email });
        if(existing) return res.status(400).json({ error: 'Email already registered' });

        // Save new student
        const student = new Student({ name, email, password });
        await student.save();

        res.status(201).json({ message: 'Student created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email, password });
        if(!student) return res.status(400).json({ error: 'Invalid email or password' });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;