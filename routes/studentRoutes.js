// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Get all students for a user
router.get('/:userId', async (req, res) => {
    try {
        const students = await Student.findByUserId(req.params.userId);
        res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
});

// Get student stats
router.get('/stats/:userId', async (req, res) => {
    try {
        const stats = await Student.getStats(req.params.userId);
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
});

// Create new student
router.post('/', async (req, res) => {
    try {
        const { name, grade, course, score, userId } = req.body;

        // Validation
        if (!name || !grade || !course || !score || !userId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newStudent = await Student.create({
            name,
            grade,
            course,
            score: parseInt(score),
            userId
        });

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            student: newStudent
        });

    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding student',
            error: error.message
        });
    }
});

// Update student
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.update(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Student updated successfully',
            student: updatedStudent
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        await Student.delete(req.params.id);
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
});

module.exports = router;