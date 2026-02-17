import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building } from 'lucide-react';
import { register } from '../api';

const RegisterPage = () => {
    const [role, setRole] = useState('candidate');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await register({ ...formData, role });
            const { token, user } = response.data;

            // Auto Login after registration
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                navigate('/candidate-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <motion.div
                className="glass"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="logo" style={{ marginBottom: '0.5rem' }}>JOB OPTIMAL</div>
                    <h2 style={{ fontSize: '2rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join the smart job revolution</p>
                </div>
                <form onSubmit={handleRegister}>
                    {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
                        <input name="full_name" type="text" className="form-control" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
                        <input name="email" type="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>I am a...</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div
                            onClick={() => setRole('candidate')}
                            style={{
                                padding: '1rem',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                borderColor: role === 'candidate' ? 'var(--primary-color)' : 'var(--glass-border)',
                                background: role === 'candidate' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                            }}
                        >
                            <User size={24} style={{ marginBottom: '0.5rem' }} />
                            <div>Candidate</div>
                        </div>
                        <div
                            onClick={() => setRole('recruiter')}
                            style={{
                                padding: '1rem',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                borderColor: role === 'recruiter' ? 'var(--primary-color)' : 'var(--glass-border)',
                                background: role === 'recruiter' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                            }}
                        >
                            <Building size={24} style={{ marginBottom: '0.5rem' }} />
                            <div>Recruiter</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                        <input name="password" type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? "Creating Account..." : "Get Started"}
                    </button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
