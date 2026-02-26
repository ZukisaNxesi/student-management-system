// models/student.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class Student {
    // Create a new student
    static async create(studentData) {
        const { name, grade, course, score, userId } = studentData;

        const { data, error } = await supabase
            .from('students')
            .insert([
                {
                    name,
                    grade,
                    course,
                    score,
                    user_id: userId
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    }

    // Get all students for a user
    static async findByUserId(userId) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Get student by ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Update student
    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('students')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    }

    // Delete student
    static async delete(id) {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // Get stats for a user
    static async getStats(userId) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        const total = data.length;
        const avgScore = data.length > 0 
            ? Math.round(data.reduce((sum, s) => sum + s.score, 0) / data.length) 
            : 0;
        
        // Find top performer
        let topPerformer = 'N/A';
        if (data.length > 0) {
            const top = data.reduce((max, student) => 
                student.score > max.score ? student : max, data[0]);
            topPerformer = top.name;
        }

        return {
            total,
            avgScore: avgScore + '%',
            topPerformer
        };
    }
}

module.exports = Student;