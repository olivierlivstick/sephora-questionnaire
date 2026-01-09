const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { runQuery, getAll } = require('../models/database');

// Store original Excel template
let excelTemplate = null;

/**
 * Import Excel questionnaire and populate database
 */
async function importExcel(filePath) {
    console.log('📖 Reading Excel file:', filePath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Store template for later export
    excelTemplate = workbook;

    // Clear existing data
    await runQuery('DELETE FROM responses');
    await runQuery('DELETE FROM questions');
    await runQuery('DELETE FROM sheets');

    console.log('🗑️  Cleared existing data');

    // Import sheets
    const sheetMapping = {
        '1 - General description': { order: 1, description: 'General descriptive information about the IT project' },
        '2 - Qualification': { order: 2, description: 'Data mapping and security requirements qualification' },
        '3 - 3rd Party Security Policy': { order: 3, description: 'Third party security policy requirements' },
        '4 - 3rd Party Assessment ': { order: 4, description: 'Organizational and technical security assessment' },
        '5 - Risk Assessment': { order: 5, description: 'Risk analysis and security controls' }
    };

    for (const [sheetName, sheetInfo] of Object.entries(sheetMapping)) {
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) continue;

        // Insert sheet
        const sheetResult = await runQuery(
            'INSERT INTO sheets (name, display_name, order_index, description) VALUES (?, ?, ?, ?)',
            [sheetName, sheetName, sheetInfo.order, sheetInfo.description]
        );

        console.log(`📄 Processing sheet: ${sheetName}`);

        // Import questions based on sheet type
        if (sheetName === '1 - General description') {
            await importGeneralDescriptionSheet(sheet, sheetResult.id);
        } else if (sheetName === '3 - 3rd Party Security Policy') {
            await importSecurityPolicySheet(sheet, sheetResult.id);
        } else if (sheetName === '4 - 3rd Party Assessment ') {
            await importAssessmentSheet(sheet, sheetResult.id);
        } else if (sheetName === '2 - Qualification') {
            await importQualificationSheet(sheet, sheetResult.id);
        } else if (sheetName === '5 - Risk Assessment') {
            await importRiskAssessmentSheet(sheet, sheetResult.id);
        }
    }

    console.log('✅ Excel import completed');

    // Save template to disk
    const templatePath = path.join(__dirname, '..', 'uploads', 'template.xlsx');
    await workbook.xlsx.writeFile(templatePath);

    return { success: true, message: 'Excel imported successfully' };
}

/**
 * Import General Description sheet
 */
async function importGeneralDescriptionSheet(sheet, sheetId) {
    const questions = [
        { row: 3, col: 'C', label: 'Project Title', cell: 'C3' },
        { row: 4, col: 'C', label: 'Objectives', cell: 'C4' },
        { row: 5, col: 'C', label: 'Main Functions', cell: 'C5' },
        { row: 6, col: 'C', label: 'Business Domain', cell: 'C6' },
        { row: 7, col: 'C', label: 'Department', cell: 'C7' },
        { row: 8, col: 'C', label: 'Scope', cell: 'C8' },
        { row: 8, col: 'J', label: 'IT Project Manager', cell: 'J8' },
        { row: 9, col: 'C', label: 'Operational points', cell: 'C9' },
        { row: 10, col: 'C', label: 'Hosting', cell: 'C10' },
        { row: 11, col: 'C', label: 'Exposure', cell: 'C11' },
        { row: 14, col: 'C', label: 'API', cell: 'C14' }
    ];

    for (const q of questions) {
        const cellValue = sheet.getCell(q.cell).value;
        await runQuery(
            `INSERT INTO questions (sheet_id, row_number, title, cell_column, question_type)
             VALUES (?, ?, ?, ?, ?)`,
            [sheetId, q.row, q.label, q.col, 'text']
        );

        // If cell has existing value, store as response
        if (cellValue) {
            const questionResult = await runQuery('SELECT last_insert_rowid() as id');
            await runQuery(
                'INSERT INTO responses (question_id, response_text) VALUES (?, ?)',
                [questionResult.id, String(cellValue)]
            );
        }
    }
}

/**
 * Import Security Policy sheet (main questionnaire)
 */
async function importSecurityPolicySheet(sheet, sheetId) {
    // Start from row 3 (first data row after headers)
    for (let rowNum = 3; rowNum <= 100; rowNum++) { // First 100 rows for now
        const row = sheet.getRow(rowNum);

        const chapter = row.getCell(1).value;
        const questionId = row.getCell(3).value;
        const title = row.getCell(4).value;
        const description = row.getCell(5).value;

        if (!title && !description) continue; // Skip empty rows

        await runQuery(
            `INSERT INTO questions (sheet_id, row_number, question_id, chapter, title, description, cell_column, question_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [sheetId, rowNum, questionId, chapter, title, description, 'I', 'compliance']
        );
    }
}

/**
 * Import Assessment sheet
 */
async function importAssessmentSheet(sheet, sheetId) {
    for (let rowNum = 5; rowNum <= 50; rowNum++) { // First 50 questions
        const row = sheet.getRow(rowNum);

        const questionId = row.getCell(2).value;
        const questionEn = row.getCell(3).value;
        const questionFr = row.getCell(4).value;

        if (!questionEn && !questionFr) continue;

        await runQuery(
            `INSERT INTO questions (sheet_id, row_number, question_id, question_text, question_text_fr, cell_column, question_type)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sheetId, rowNum, questionId, questionEn, questionFr, 'D', 'text']
        );
    }
}

/**
 * Import Qualification sheet
 */
async function importQualificationSheet(sheet, sheetId) {
    // Data mapping section
    const dataMappingRows = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    for (const rowNum of dataMappingRows) {
        const row = sheet.getRow(rowNum);
        const label = row.getCell(2).value;

        if (label) {
            await runQuery(
                `INSERT INTO questions (sheet_id, row_number, title, cell_column, question_type)
                 VALUES (?, ?, ?, ?, ?)`,
                [sheetId, rowNum, label, 'C', 'select']
            );
        }
    }
}

/**
 * Import Risk Assessment sheet
 */
async function importRiskAssessmentSheet(sheet, sheetId) {
    // Risk rows
    for (let rowNum = 4; rowNum <= 10; rowNum++) {
        const row = sheet.getRow(rowNum);
        const riskDesc = row.getCell(3).value;

        if (riskDesc) {
            await runQuery(
                `INSERT INTO questions (sheet_id, row_number, title, description, cell_column, question_type)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [sheetId, rowNum, `Risk R${rowNum - 3}`, riskDesc, 'C', 'text']
            );
        }
    }
}

/**
 * Export responses to Excel
 */
async function exportExcel() {
    console.log('📥 Starting Excel export...');

    // Load template
    const templatePath = path.join(__dirname, '..', 'uploads', 'template.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Get all responses
    const responses = await getAll(`
        SELECT q.sheet_id, q.row_number, q.cell_column, r.response_text, s.name as sheet_name
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        JOIN sheets s ON q.sheet_id = s.id
        WHERE r.response_text IS NOT NULL
    `);

    console.log(`📝 Found ${responses.length} responses to export`);

    // Apply responses to template
    for (const response of responses) {
        const sheet = workbook.getWorksheet(response.sheet_name);
        if (sheet) {
            const cell = `${response.cell_column}${response.row_number}`;
            sheet.getCell(cell).value = response.response_text;
        }
    }

    // Save to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    console.log('✅ Excel export completed');

    return buffer;
}

module.exports = {
    importExcel,
    exportExcel
};
