# Implementation Plan - Job Optimal

AI-Driven Smart Job Matching Platform. Designed for the South Asian market (Bangladesh/India) to bridge the gap between skills and recruitment.

## 1. Technology Stack
*   **Frontend:** HTML5, Modern CSS (Glassmorphism, Animations), Vanilla JavaScript.
*   **Backend:** PHP (XAMPP environment).
*   **Database:** MySQL (Relational structure with triggers and stored procedures).
*   **AI Components:** 
    *   Resume Parsing (NLP-based logic).
    *   Matching Algorithm (Weighted similarity).
*   **Security:** Password hashing, Session management, Hashed verification for certificates.

## 2. Database Schema (MySQL)
*   `users`: (id, name, email, password, role [candidate/recruiter/admin], created_at)
*   `candidates`: (user_id, bio, profile_pic, resume_path, skill_score, location, expected_salary)
*   `recruiters`: (user_id, company_name, industry, location, verified_status)
*   `jobs`: (id, recruiter_id, title, description, requirements, salary_range, location, type [full-time/part-time/remote])
*   `skills`: (id, name)
*   `candidate_skills`: (candidate_id, skill_id, proficiency)
*   `job_skills`: (job_id, skill_id, weight)
*   `applications`: (id, job_id, candidate_id, match_score, status, applied_at)
*   `assessments`: (id, title, category, content [JSON])
*   `scores`: (id, user_id, assessment_id, score, date)
*   `certificates`: (id, user_id, issuer, hash, status)
*   `reports`: (id, reporter_id, reported_id, reason, date)

## 3. Phased Roadmap

### Phase 1: Foundation & Branding
*   Setup directory structure (`assets`, `includes`, `actions`, `views`).
*   Design a premium, high-impact landing page.
*   Implement User Authentication (Registration/Login).

### Phase 2: Candidate Module
*   Profile builder.
*   Resume upload & (simulated) NLP extraction.
*   Skill assessment interface.

### Phase 3: Recruiter Module
*   Job posting system.
*   AI-ranked applicant dashboard.
*   Skill heatmap visualization.

### Phase 4: Matching Engine & Advanced Features
*   Weighted matching algorithm (PHP).
*   Mock "Blockchain" verification (SHA-256 hashing).
*   Fraud reporting system.

## 4. Visual Language
*   **Palette:** Deep Navy, Electric Blue, Slate Grey, and Emerald Green (for success/verification).
*   **Theme:** Modern, sleek, "Dark Mode" first approach or "Clean Glass" tech aesthetic.
*   **Animations:** Smooth transitions using CSS Keyframes and Intersection Observer.
