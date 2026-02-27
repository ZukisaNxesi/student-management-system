// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all students for a user
router.get('/:userId', async (req, res) => {
    try {
        console.log('📋 Fetching students for user:', req.params.userId);
        
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }

        console.log(`✅ Found ${data?.length || 0} students`);
        res.json({
            success: true,
            students: data || []
        });
    } catch (error) {
        console.error('🔥 Get students error:', error);
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
        console.log('📊 Fetching stats for user:', req.params.userId);
        
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', req.params.userId);

        if (error) throw error;

        const students = data || [];
        const total = students.length;
        
        let avgScore = 0;
        let topPerformer = 'N/A';
        
        if (total > 0) {
            avgScore = Math.round(students.reduce((sum, s) => sum + s.score, 0) / total);
            const top = students.reduce((max, s) => s.score > max.score ? s : max, students[0]);
            topPerformer = top.name;
        }

        const stats = {
            total,
            avgScore: avgScore + '%',
            topPerformer
        };

        console.log('✅ Stats calculated:', stats);
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('🔥 Stats error:', error);
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
        const { name, grade, course, score, status, userId } = req.body;
        
        console.log('➕ Adding new student:', { name, grade, course, score, status, userId });

        // Validation
        if (!name || !grade || !course || !score || !userId) {
            console.log('❌ Missing fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('students')
            .insert([
                {
                    name,
                    grade,
                    course,
                    score: parseInt(score),
                    status: status || 'active',
                    user_id: userId
                }
            ])
            .select();

        if (error) {
            console.error('❌ Supabase insert error:', error);
            throw error;
        }

        console.log('✅ Student added successfully:', data[0]);
        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            student: data[0]
        });
    } catch (error) {
        console.error('🔥 Create student error:', error);
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
        const { name, grade, course, score, status } = req.body;
        const studentId = req.params.id;
        
        console.log('✏️ Updating student:', studentId, { name, grade, course, score, status });

        const { data, error } = await supabase
            .from('students')
            .update({ name, grade, course, score: parseInt(score), status })
            .eq('id', studentId)
            .select();

        if (error) throw error;

        console.log('✅ Student updated successfully');
        res.json({
            success: true,
            message: 'Student updated successfully',
            student: data[0]
        });
    } catch (error) {
        console.error('🔥 Update student error:', error);
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
        const studentId = req.params.id;
        console.log('🗑️ Deleting student:', studentId);

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', studentId);

        if (error) throw error;

        console.log('✅ Student deleted successfully');
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('🔥 Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
});

module.exports = router;