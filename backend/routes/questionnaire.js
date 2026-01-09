const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../models/database');

// Get all sheets
router.get('/sheets', async (req, res) => {
    try {
        const sheets = await getAll('SELECT * FROM sheets ORDER BY order_index');
        res.json(sheets);
    } catch (error) {
        console.error('Error fetching sheets:', error);
        res.status(500).json({ error: 'Failed to fetch sheets' });
    }
});

// Get questions for a specific sheet
router.get('/sheets/:sheetId/questions', async (req, res) => {
    try {
        const { sheetId } = req.params;
        const { search } = req.query;

        let query = `
            SELECT q.*, r.response_text, r.response_value, r.user_id, r.updated_at as response_updated_at
            FROM questions q
            LEFT JOIN responses r ON q.id = r.question_id
            WHERE q.sheet_id = ?
        `;

        const params = [sheetId];

        if (search) {
            query += ` AND (q.title LIKE ? OR q.description LIKE ? OR q.question_text LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY q.row_number';

        const questions = await getAll(query, params);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Get a single question with its response
router.get('/questions/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await getOne(`
            SELECT q.*, r.response_text, r.response_value, r.user_id, r.updated_at as response_updated_at
            FROM questions q
            LEFT JOIN responses r ON q.id = r.question_id
            WHERE q.id = ?
        `, [questionId]);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Get comments for this question
        const comments = await getAll(`
            SELECT c.*, u.username, u.full_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.question_id = ?
            ORDER BY c.created_at DESC
        `, [questionId]);

        res.json({ ...question, comments });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// Save/update response
router.post('/questions/:questionId/response', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { response_text, response_value, user_id } = req.body;

        // Check if response exists
        const existingResponse = await getOne(
            'SELECT id FROM responses WHERE question_id = ?',
            [questionId]
        );

        if (existingResponse) {
            // Update existing response
            await runQuery(
                `UPDATE responses
                 SET response_text = ?, response_value = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE question_id = ?`,
                [response_text, response_value, user_id, questionId]
            );
        } else {
            // Create new response
            await runQuery(
                'INSERT INTO responses (question_id, response_text, response_value, user_id) VALUES (?, ?, ?, ?)',
                [questionId, response_text, response_value, user_id]
            );
        }

        // Log activity
        if (user_id) {
            await runQuery(
                'INSERT INTO activity_log (user_id, question_id, action, details) VALUES (?, ?, ?, ?)',
                [user_id, questionId, 'response_updated', response_text?.substring(0, 100)]
            );
        }

        res.json({ message: 'Response saved successfully' });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ error: 'Failed to save response' });
    }
});

// Add comment to a question
router.post('/questions/:questionId/comments', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { comment_text, user_id } = req.body;

        if (!comment_text || !user_id) {
            return res.status(400).json({ error: 'Comment text and user ID are required' });
        }

        const result = await runQuery(
            'INSERT INTO comments (question_id, user_id, comment_text) VALUES (?, ?, ?)',
            [questionId, user_id, comment_text]
        );

        // Get the created comment with user info
        const comment = await getOne(`
            SELECT c.*, u.username, u.full_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `, [result.id]);

        // Log activity
        await runQuery(
            'INSERT INTO activity_log (user_id, question_id, action, details) VALUES (?, ?, ?, ?)',
            [user_id, questionId, 'comment_added', comment_text.substring(0, 100)]
        );

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get completion statistics
router.get('/stats', async (req, res) => {
    try {
        const totalQuestions = await getOne('SELECT COUNT(*) as count FROM questions');
        const answeredQuestions = await getOne(`
            SELECT COUNT(DISTINCT question_id) as count
            FROM responses
            WHERE response_text IS NOT NULL AND response_text != ''
        `);

        const stats = {
            total: totalQuestions.count,
            completed: answeredQuestions.count,
            percentage: totalQuestions.count > 0
                ? Math.round((answeredQuestions.count / totalQuestions.count) * 100)
                : 0
        };

        // Stats by sheet
        const sheetStats = await getAll(`
            SELECT
                s.id,
                s.name,
                s.display_name,
                COUNT(q.id) as total_questions,
                COUNT(r.id) as answered_questions,
                ROUND(CAST(COUNT(r.id) AS FLOAT) / COUNT(q.id) * 100, 2) as completion_percentage
            FROM sheets s
            LEFT JOIN questions q ON s.id = q.sheet_id
            LEFT JOIN responses r ON q.id = r.question_id AND r.response_text IS NOT NULL AND r.response_text != ''
            GROUP BY s.id
            ORDER BY s.order_index
        `);

        res.json({ overall: stats, bySheet: sheetStats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get recent activity
router.get('/activity', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const activity = await getAll(`
            SELECT
                a.*,
                u.username,
                u.full_name,
                q.title as question_title
            FROM activity_log a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN questions q ON a.question_id = q.id
            ORDER BY a.created_at DESC
            LIMIT ?
        `, [limit]);

        res.json(activity);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

module.exports = router;
