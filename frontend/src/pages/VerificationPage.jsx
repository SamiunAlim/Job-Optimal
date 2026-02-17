import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

const VerificationPage = () => {
    const [hash, setHash] = useState('');
    const [result, setResult] = useState(null);

    const handleVerify = (e) => {
        e.preventDefault();
        if (hash.endsWith('123')) {
            setResult({
                valid: true,
                name: "Adnan Sami",
                issuer: "Tech Academy",
                date: "2025-05-10"
            });
        } else {
            setResult({ valid: false });
        }
    };

    return (
        <DashboardLayout role="recruiter">
            <div style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1>Tamper-Proof Verification</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter the unique SHA-256 certificate hash to verify authenticity.</p>
                </div>

                <form onSubmit={handleVerify} style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 5e884898da28047151d0e56f8dc..."
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary">Verify</button>
                </form>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass"
                        style={{ padding: '2rem', textAlign: 'center', borderColor: result.valid ? 'var(--secondary-color)' : '#ef4444' }}
                    >
                        {result.valid ? (
                            <>
                                <CheckCircle size={48} style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }} />
                                <h3 style={{ color: 'var(--secondary-color)' }}>Verified Certificate</h3>
                                <p style={{ margin: '1rem 0' }}>This document is authentic and belongs to <strong>{result.name}</strong>.</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Issued by: {result.issuer} on {result.date}</p>
                            </>
                        ) : (
                            <>
                                <XCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                                <h3 style={{ color: '#ef4444' }}>Invalid Hash</h3>
                                <p>No verified certificate found with this unique identifier.</p>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default VerificationPage;
