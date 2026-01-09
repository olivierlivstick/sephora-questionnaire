require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase, getOne } = require('./models/database');
const { importExcel } = require('./controllers/excelController');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

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

// Auto-initialize database with sample data on first run
async function autoInitialize() {
    try {
        // Check if users exist
        const userExists = await getOne('SELECT COUNT(*) as count FROM users');

        if (!userExists || userExists.count === 0) {
            console.log('🔧 First run detected - Auto-initializing database...');

            // Create default admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const { runQuery } = require('./models/database');
            await runQuery(
                'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
                ['admin', 'admin@sephora.local', hashedPassword, 'Administrator', 'admin']
            );

            // Create sample users
            const sampleUsers = [
                { username: 'olivier', email: 'olivier@sephora.local', name: 'Olivier Adler', password: 'olivier123' },
                { username: 'paul', email: 'paul@sephora.local', name: 'Paul Blaise', password: 'paul123' },
                { username: 'imane', email: 'imane@sephora.local', name: 'Imane Miloud', password: 'imane123' }
            ];

            for (const user of sampleUsers) {
                const hashedPwd = await bcrypt.hash(user.password, 10);
                await runQuery(
                    'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                    [user.username, user.email, hashedPwd, user.name]
                );
            }

            // Import Excel questionnaire
            const excelPath = path.join(__dirname, 'SEPHORA - 3rd Party Security Framework.xlsx');
            if (fs.existsSync(excelPath)) {
                console.log('📥 Importing Excel questionnaire...');
                await importExcel(excelPath);
                console.log('✅ Auto-initialization complete!');
            } else {
                console.log('⚠️ Excel file not found, skipping import');
            }
        }
    } catch (error) {
        console.error('Auto-initialization error:', error.message);
        // Continue anyway - don't crash the server
    }
}

// Initialize database and start server
initDatabase()
    .then(() => autoInitialize())
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
