const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Post a Job
router.post('/post', async (req, res) => {
    const { recruiter_id, title, description, salary_range, location, job_type, skills } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO jobs (recruiter_id, title, description, salary_range, location, job_type) VALUES (?, ?, ?, ?, ?, ?)',
            [recruiter_id, title, description, salary_range, location, job_type]
        );
        const jobId = result.insertId;

        // Skill handling (Simplified for MVP)
        if (skills && Array.isArray(skills)) {
            for (const skillName of skills) {
                await db.execute('INSERT IGNORE INTO skills (skill_name) VALUES (?)', [skillName.trim()]);
                const [[skill]] = await db.execute('SELECT id FROM skills WHERE skill_name = ?', [skillName.trim()]);
                await db.execute('INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)', [jobId, skill.id]);
            }
        }

        res.status(201).json({ message: 'Job posted successfully', jobId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Jobs (with matching score logic placeholder)
router.get('/all', async (req, res) => {
    try {
        const [jobs] = await db.execute(`
            SELECT j.*, r.company_name 
            FROM jobs j 
            JOIN recruiters r ON j.recruiter_id = r.id
        `);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
