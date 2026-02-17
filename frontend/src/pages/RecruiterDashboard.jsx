import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const RecruiterDashboard = () => {
    const [user, setUser] = useState({ name: 'Recruiter' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data");
            }
        }
    }, []);

    const displayName = user.name || user.full_name || 'Recruiter';

    return (
        <DashboardLayout role="recruiter">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Welcome, {displayName.split(' ')[0]}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your job postings and AI-ranked applicants.</p>
                </div>
                <Link to="/post-job" className="btn btn-primary"><Plus size={20} /> Post New Job</Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <DashboardCard title="Active Jobs" value="5" trend="+2 this week" />
                <DashboardCard title="Total Applicants" value="142" trend="28 pending review" />
                <DashboardCard title="AI Match Rating" value="92%" trend="Average match accuracy" color="var(--secondary-color)" />
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>AI-Ranked Candidates (Top 5)</h2>
            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <tr>
                            <th style={{ padding: '1rem 2rem' }}>Candidate</th>
                            <th style={{ padding: '1rem 2rem' }}>Position</th>
                            <th style={{ padding: '1rem 2rem' }}>Match Score</th>
                            <th style={{ padding: '1rem 2rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CandidateRow name="Adnan Sami" position="Frontend Engineer" score="98%" scoreType="high" />
                        <CandidateRow name="Zarin Subah" position="UI/UX Designer" score="94%" scoreType="high" />
                        <CandidateRow name="Tanvir Ahmed" position="Backend Developer" score="82%" scoreType="med" />
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

const DashboardCard = ({ title, value, trend, color = 'white' }) => (
    <div className="glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>{title}</h3>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: color }}>{value}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{trend}</div>
    </div>
);

const CandidateRow = ({ name, position, score, scoreType }) => (
    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <td style={{ padding: '1rem 2rem' }}>{name}</td>
        <td style={{ padding: '1rem 2rem' }}>{position}</td>
        <td style={{ padding: '1rem 2rem' }}>
            <span className="glass" style={{
                padding: '0.3rem 0.8rem',
                borderColor: scoreType === 'high' ? 'var(--secondary-color)' : 'var(--primary-color)',
                color: scoreType === 'high' ? 'var(--secondary-color)' : 'var(--primary-color)'
            }}>
                {score}
            </span>
        </td>
        <td style={{ padding: '1rem 2rem' }}><button className="btn glass" style={{ padding: '0.5rem 1rem' }}>View Profile</button></td>
    </tr>
);

export default RecruiterDashboard;
