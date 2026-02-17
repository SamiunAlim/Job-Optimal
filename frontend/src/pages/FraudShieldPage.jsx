import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

const FraudShieldPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <DashboardLayout role="candidate">
            <div style={{ maxWidth: '800px' }}>
                <h1 style={{ marginBottom: '1rem' }}>Anonymous Fraud Shield</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Report suspicious companies or fake job postings. Your identity remains 100% encrypted.</p>

                {!submitted ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '3rem' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Company Name</label>
                                <input type="text" className="form-control" placeholder="Who are you reporting?" required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Report Type</label>
                                <select className="form-control" style={{ background: '#0f172a' }}>
                                    <option>Fake Job Posting</option>
                                    <option>Payment/Scam Request</option>
                                    <option>Impersonation</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Details / Evidence</label>
                                <textarea className="form-control" rows="5" placeholder="Please describe what happened..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ background: '#ef4444' }}>
                                <ShieldAlert size={18} /> Submit Anonymous Report
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                        <CheckCircle size={64} style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem' }} />
                        <h2>Report Filed Safely</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Our security team will investigate this company. Thank you for keeping the community safe.</p>
                        <button className="btn glass" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>File Another Report</button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FraudShieldPage;
