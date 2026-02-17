const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function seed() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log("Cleaning old data...");
        // Ensure recruiters exist first to avoid FK errors
        const [users] = await db.execute("SELECT id FROM users WHERE email = 'recruiter@google.com'");
        let recruiterId;

        if (users.length === 0) {
            console.log("Creating sample recruiter...");
            const [userResult] = await db.execute("INSERT INTO users (full_name, email, password, role) VALUES ('Google Recruitment', 'recruiter@google.com', 'password123', 'recruiter')");
            const [recResult] = await db.execute("INSERT INTO recruiters (user_id, company_name, industry, company_location) VALUES (?, 'Google', 'Technology', 'California, USA')", [userResult.insertId]);
            recruiterId = recResult.insertId;
        } else {
            const [recs] = await db.execute("SELECT id FROM recruiters WHERE user_id = ?", [users[0].id]);
            recruiterId = recs[0].id;
        }

        console.log("Inserting jobs...");
        await db.execute("DELETE FROM jobs"); // Clear existing empty jobs

        const sampleJobs = [
            [recruiterId, 'Senior AI Engineer', 'Looking for an expert to build LLM pipelines and smart agents.', 'Python, OpenAI, LangChain', '$180k - $250k', 'Remote', 'full-time'],
            [recruiterId, 'Full Stack React Developer', 'Help us build a beautiful dashboard for our AI products.', 'React, Node.js, Tailwind', '$120k - $160k', 'New York, USA', 'full-time'],
            [recruiterId, 'UI/UX Designer', 'Expert in glassmorphism and modern web design.', 'Figma, Adobe XD, Animation', '80k - 100k BDT', 'Dhaka, BD', 'remote'],
            [recruiterId, 'Junior Python Developer', 'Develop automation scripts and API endpoints.', 'Python, Flask, SQL', '40k - 55k BDT', 'Dhaka, BD', 'full-time']
        ];

        for (const job of sampleJobs) {
            await db.execute(
                "INSERT INTO jobs (recruiter_id, title, description, requirements, salary_range, location, job_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
                job
            );
        }

        console.log("Success! 4 samples jobs added.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await db.end();
    }
}

seed();
