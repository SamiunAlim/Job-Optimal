import React, { useState, useEffect } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

const CandidateDashboard = () => {
    const [user, setUser] = useState({ name: 'Guest', email: '' });

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

    // Resilience: Check for either .name (backend) or .full_name (fallback)
    const displayName = user.name || user.full_name || 'Guest';
    const nameInitial = displayName.charAt(0);

    return (
        <DashboardLayout role="candidate">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Hello, {displayName.split(' ')[0]}!</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Explore your personalized career matches.</p>
                </div>
                <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>{nameInitial}</div>
                    <span>{displayName}</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard number="85%" label="Skill Score" />
                <StatCard number="12" label="Matches Found" />
                <StatCard number="3" label="Applications" />
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>AI Resume Analyzer</h2>
            <motion.div
                className="glass"
                whileHover={{ scale: 1.01 }}
                style={{ padding: '3rem', border: '2px dashed var(--glass-border)', textAlign: 'center', borderRadius: '16px', marginBottom: '3rem', cursor: 'pointer' }}
            >
                <UploadCloud size={48} style={{ marginBottom: '1rem', color: 'var(--primary-color)' }} />
                <h3>Upload your Resume (PDF/DOC)</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Let our AI extract your skills and optimize your profile instantly.</p>
            </motion.div>

            <h2 style={{ marginBottom: '1.5rem' }}>Recommended for You</h2>
            <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                <Sparkles size={32} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Upload your resume to unlock AI-driven personalized recommendations.</p>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ number, label }) => (
    <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{number}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
);

export default CandidateDashboard;
