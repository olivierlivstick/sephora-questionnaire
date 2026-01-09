const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { importExcel, exportExcel } = require('../controllers/excelController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, 'original-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

// Import Excel file
router.post('/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('📤 Received file:', req.file.originalname);

        const result = await importExcel(req.file.path);

        res.json({
            message: 'Excel file imported successfully',
            ...result
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import Excel file: ' + error.message });
    }
});

// Export Excel file with responses
router.get('/export', async (req, res) => {
    try {
        const buffer = await exportExcel();

        const filename = `SEPHORA-Questionnaire-Completed-${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export Excel file: ' + error.message });
    }
});

module.exports = router;
