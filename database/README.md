-- Database Documentation for Job Optimal

-- To set up the database:
-- 1. Open phpMyAdmin or your MySQL client
-- 2. Create a database named `job_optimal`
-- 3. Import the `setup_db.sql` file located in this folder

-- Key Relationships:
-- - Users -> Candidates (One-to-One)
-- - Users -> Recruiters (One-to-One)
-- - Recruiters -> Jobs (One-to-Many)
-- - Candidates/Jobs -> Skills (Many-to-Many)
-- - Candidates/Jobs -> Applications (Many-to-Many)

-- Matching Algorithm Data:
-- The platform uses `skill_id` and `proficiency_level` to calculate the Match Score in the backend.
