# Job Optimal Backend (Node.js)

AI-Powered Job Matching API.

## 🛠️ Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` file:
    *   Set `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME` to match your MySQL settings.
4.  Start the server:
    ```bash
    node server.js
    ```

## 📡 API Endpoints

### Auth
*   `POST /api/auth/register` - { full_name, email, password, role }
*   `POST /api/auth/login` - { email, password }

### Jobs
*   `POST /api/jobs/post` - { recruiter_id, title, description, skills[], ... }
*   `GET /api/jobs/all` - Lists all jobs with recruiter details.

### Profile
*   `GET /api/profile/candidate/:userId` - Fetches candidate bio and skills.

## 🔐 Security
*   **BCryptJS**: Used for military-grade password hashing.
*   **JWT**: JSON Web Tokens for secure session management.
*   **CORS**: Enabled for seamless React-to-Node communication.
