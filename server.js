// Suppress dotenv logs
process.env.DOTENV_CONFIG_DEBUG = false;
require('dotenv').config({ debug: false });

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// DEBUG: Check if route files are loading
console.log('\n🔍 DEBUG: Loading routes...');

let authRoutes, studentRoutes;

try {
    authRoutes = require('./routes/authRoutes');
    console.log('✅ authRoutes loaded successfully');
} catch (error) {
    console.error('❌ Failed to load authRoutes:', error.message);
}

try {
    studentRoutes = require('./routes/studentRoutes');
    console.log('✅ studentRoutes loaded successfully');
} catch (error) {
    console.error('❌ Failed to load studentRoutes:', error.message);
}

// Use routes if they loaded successfully
if (authRoutes) {
    app.use('/api/auth', authRoutes);
    console.log('✅ Registered /api/auth routes');
}

if (studentRoutes) {
    app.use('/api/students', studentRoutes);
    console.log('✅ Registered /api/students routes');
}

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working!',
        routes: {
            auth: authRoutes ? '✅ Loaded' : '❌ Not loaded',
            students: studentRoutes ? '✅ Loaded' : '❌ Not loaded'
        }
    });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    console.log(`❌ API route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        success: false, 
        message: 'API route not found',
        requestedUrl: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 SERVER STARTED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`📍 Local server: http://localhost:${PORT}`);
    console.log(`🔍 Test API: http://localhost:${PORT}/api/test`);
    console.log('='.repeat(50) + '\n');
});