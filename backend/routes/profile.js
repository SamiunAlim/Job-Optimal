const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get General Profile
router.get('/:userId', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, full_name, email, role FROM users WHERE id = ?', [req.params.userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        let extraInfo = {};

        if (user.role === 'candidate') {
            const [info] = await db.execute('SELECT * FROM candidates WHERE user_id = ?', [user.id]);
            extraInfo = info[0] || {};
        } else {
            const [info] = await db.execute('SELECT * FROM recruiters WHERE user_id = ?', [user.id]);
            extraInfo = info[0] || {};
        }

        res.json({ ...user, extraInfo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const bcrypt = require('bcryptjs');

// Update Profile
router.put('/update', async (req, res) => {
    const { user_id, full_name, bio, location, company_name, password } = req.body;
    try {
        // Update user table
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('UPDATE users SET full_name = ?, password = ? WHERE id = ?', [full_name, hashedPassword, user_id]);
        } else {
            await db.execute('UPDATE users SET full_name = ? WHERE id = ?', [full_name, user_id]);
        }

        // Update role-specific table
        const [user] = await db.execute('SELECT role FROM users WHERE id = ?', [user_id]);
        if (user.length > 0) {
            if (user[0].role === 'candidate') {
                await db.execute('UPDATE candidates SET bio = ?, location = ? WHERE user_id = ?', [bio, location, user_id]);
            } else {
                await db.execute('UPDATE recruiters SET company_name = ?, company_location = ? WHERE user_id = ?', [company_name, location, user_id]);
            }
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Candidate Profile (Specific)
router.get('/candidate/:userId', async (req, res) => {
    try {
        const [candidate] = await db.execute(`
            SELECT u.full_name, c.* 
            FROM users u 
            JOIN candidates c ON u.id = c.user_id 
            WHERE u.id = ?`, [req.params.userId]);

        if (candidate.length === 0) return res.status(404).json({ message: 'Profile not found' });

        const [skills] = await db.execute(`
            SELECT s.skill_name, cs.proficiency_level 
            FROM candidate_skills cs 
            JOIN skills s ON cs.skill_id = s.id 
            WHERE cs.candidate_id = ?`, [candidate[0].id]);

        res.json({ ...candidate[0], skills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
