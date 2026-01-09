/**
 * Script to initialize the database with Sephora questionnaire
 * Run: node scripts/init-data.js
 */

require('dotenv').config();
const path = require('path');
const { initDatabase, runQuery } = require('../models/database');
const { importExcel } = require('../controllers/excelController');
const bcrypt = require('bcryptjs');

async function initializeData() {
    console.log('🚀 Initializing Sephora Questionnaire Database\n');

    try {
        // 1. Initialize database schema
        console.log('📊 Creating database schema...');
        await initDatabase();

        // 2. Create default admin user
        console.log('👤 Creating default admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await runQuery(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@sephora.local', hashedPassword, 'Administrator', 'admin']
        );
        console.log('   ✓ Admin user created (username: admin, password: admin123)');

        // 3. Create sample users
        console.log('👥 Creating sample users...');
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
            console.log(`   ✓ User created: ${user.username}`);
        }

        // 4. Import Excel questionnaire
        console.log('\n📥 Importing Sephora Excel questionnaire...');
        const excelPath = path.join(__dirname, '../../../SEPHORA - 3rd Party Security Framework.xlsx');
        await importExcel(excelPath);

        console.log('\n✅ Database initialized successfully!\n');
        console.log('📝 You can now:');
        console.log('   1. Start the server: npm run dev');
        console.log('   2. Login with: admin / admin123');
        console.log('   3. Or use any sample user (olivier, paul, imane) with password: <username>123\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error initializing database:', error.message);
        console.error(error);
        process.exit(1);
    }
}

initializeData();
