-- Database Setup for Job Optimal
CREATE DATABASE IF NOT EXISTS job_optimal;
USE job_optimal;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidate', 'recruiter', 'admin') DEFAULT 'candidate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bio TEXT,
    resume_path VARCHAR(255),
    location VARCHAR(100),
    skill_score INT DEFAULT 0,
    expected_salary DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Recruiters Table
CREATE TABLE IF NOT EXISTS recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(150),
    industry VARCHAR(100),
    company_location VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary_range VARCHAR(50),
    location VARCHAR(100),
    job_type ENUM('full-time', 'part-time', 'remote', 'internship') DEFAULT 'full-time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(50) UNIQUE NOT NULL
);

-- 6. Candidate Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level INT DEFAULT 1, -- 1 to 10
    PRIMARY KEY (candidate_id, skill_id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 6.5 Job Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS job_skills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    weight INT DEFAULT 1,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 7. Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    match_score INT DEFAULT 0,
    status ENUM('pending', 'shortlisted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 8. Assessments
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    questions_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Certificates (Blockchain Simulation)
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    certificate_name VARCHAR(150),
    issuer VARCHAR(100),
    verification_hash VARCHAR(255) UNIQUE,
    issue_date DATE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 10. Reports
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_entity_id INT NOT NULL, -- Can be recruiter ID
    report_type ENUM('fraud', 'scam', 'fake_job', 'other'),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Triggers for Auto Skill Score Update (Example)
DELIMITER //
CREATE TRIGGER update_skill_score AFTER UPDATE ON candidate_skills
FOR EACH ROW
BEGIN
    UPDATE candidates 
    SET skill_score = (SELECT AVG(proficiency_level) * 10 FROM candidate_skills WHERE candidate_id = NEW.candidate_id)
    WHERE id = NEW.candidate_id;
END;
//
DELIMITER ;
-- Add sample data for "Real World" feel
INSERT INTO users (full_name, email, password, role) VALUES 
('Google Recruitment', 'recruiter@google.com', '$2b$10$xyz', 'recruiter'),
('Ahmed Tech Solutions', 'hr@ahmedtech.bd', '$2b$10$xyz', 'recruiter');

INSERT INTO recruiters (user_id, company_name, industry, company_location) VALUES 
(3, 'Google', 'Technology', 'California, USA'),
(4, 'Ahmed Tech', 'Software Development', 'Dhaka, BD');

INSERT INTO jobs (recruiter_id, title, description, requirements, salary_range, location, job_type) VALUES 
(1, 'Senior React Developer', 'Join the Google Cloud team to build next-gen interfaces.', 'React, Redux, Node.js', '$150k - $200k', 'Remote', 'full-time'),
(2, 'Junior PHP Developer', 'Entry level position for local software house.', 'PHP, MySQL, CSS', '40k - 60k BDT', 'Dhaka, BD', 'full-time'),
(1, 'Product Designer', 'Expert in Glassmorphism and modern UI trends.', 'Figma, UI/UX, Motion', '$120k', 'New York, USA', 'remote');
