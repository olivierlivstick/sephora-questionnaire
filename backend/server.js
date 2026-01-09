require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questionnaire', require('./routes/questionnaire'));
app.use('/api/excel', require('./routes/excel'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sephora Questionnaire API is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Sephora Security Questionnaire API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            questionnaire: '/api/questionnaire',
            excel: '/api/excel'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Initialize database and start server
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 Sephora Questionnaire API Server');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📊 Database: SQLite`);
            console.log('');
            console.log('Available endpoints:');
            console.log(`  - http://localhost:${PORT}/`);
            console.log(`  - http://localhost:${PORT}/health`);
            console.log(`  - http://localhost:${PORT}/api/auth`);
            console.log(`  - http://localhost:${PORT}/api/questionnaire`);
            console.log(`  - http://localhost:${PORT}/api/excel`);
            console.log('');
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

module.exports = app;
