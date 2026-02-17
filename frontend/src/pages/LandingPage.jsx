import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Zap, ShieldCheck, BrainCircuit, TrendingUp, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="container">
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
                <div className="logo">JOB OPTIMAL</div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</Link>
                    <Link to="/login" className="btn btn-primary">Login / Sign Up</Link>
                </div>
            </nav>

            <section style={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem' }}
                >
                    AI-Driven Smart <br /><span style={{ color: 'var(--primary-color)' }}>Job Matching</span> Platform
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}
                >
                    Bridge the gap between your skills and your dream career. No more manual shortlisting, no more fake claims. Just optimal fits.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ display: 'flex', gap: '1.5rem' }}
                >
                    <Link to="/register" className="btn btn-primary">Find a Job <ArrowRight size={20} /></Link>
                    <Link to="/register?role=recruiter" className="btn glass">Join as Recruiter</Link>
                </motion.div>
            </section>

            {/* Live Stats */}
            <section style={{ padding: '2rem', marginBottom: '8rem' }}>
                <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', padding: '3rem', gap: '2rem', textAlign: 'center' }}>
                    <StatItem value="12,480+" label="Active Candidates" />
                    <StatItem value="840+" label="Verified Recruiters" />
                    <StatItem value="3,200+" label="AI Matches Today" />
                    <StatItem value="98.4%" label="Success Rate" />
                </div>
            </section>

            <section id="features" style={{ padding: '0 0 8rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {[
                    { icon: <FileText color="#3b82f6" />, title: "AI Resume Analyzer", desc: "Extract skills, education, and experience automatically using NLP. Get matching scores." },
                    { icon: <Zap color="#fbbf24" />, title: "Smart Match Engine", desc: "Advanced weighted matching algorithms based on skills and assessments." },
                    { icon: <ShieldCheck color="#10b981" />, title: "Credential Verification", desc: "Tamper-proof certificate verification powered by hashing technology." },
                    { icon: <BrainCircuit color="#8b5cf6" />, title: "AI Skill Assessment", desc: "Automated MCQ and coding tests to rank your skills against industry standards." },
                    { icon: <TrendingUp color="#ec4899" />, title: "Personalized Recs", desc: "A Netflix-like experience for your career. Get tailored job suggestions daily." },
                    { icon: <AlertOctagon color="#ef4444" />, title: "Fraud Shield", desc: "Community-based rating and anonymous reporting to eliminate fake job postings." }
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        className="glass"
                        whileHover={{ y: -10 }}
                        style={{ padding: '2.5rem' }}
                    >
                        <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{feature.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

const StatItem = ({ value, label }) => (
    <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
    </div>
);

export default LandingPage;
