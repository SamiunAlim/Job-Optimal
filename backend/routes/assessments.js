const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Save assessment score
router.post('/save', async (req, res) => {
    const { user_id, score, category } = req.body;
    try {
        await db.execute(
            'INSERT INTO candidate_skills (candidate_id, skill_id, proficiency_level) VALUES ((SELECT id FROM candidates WHERE user_id = ?), ?, ?) ON DUPLICATE KEY UPDATE proficiency_level = ?',
            [user_id, 1, Math.ceil(score / 10), Math.ceil(score / 10)]
        );
        res.json({ message: 'Score saved and profile updated!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
