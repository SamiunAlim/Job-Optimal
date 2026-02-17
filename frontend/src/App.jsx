import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import VerificationPage from './pages/VerificationPage';
import FraudShieldPage from './pages/FraudShieldPage';
import SearchJobs from './pages/SearchJobs';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Assessments from './pages/Assessments';
import SettingsPage from './pages/SettingsPage';
import PostJobPage from './pages/PostJobPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/fraud-shield" element={<FraudShieldPage />} />
        <Route path="/search-jobs" element={<SearchJobs />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
      </Routes>
    </Router>
  );
}

export default App;
