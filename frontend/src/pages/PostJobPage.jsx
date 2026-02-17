import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, MapPin, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { postJob } from '../api';

const PostJobPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        salary_range: '',
        location: '',
        job_type: 'Full-time'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const jobData = {
                ...formData,
                recruiter_id: user.id,
                skills: formData.skills.split(',').map(s => s.trim())
            };
            await postJob(jobData, token);
            alert("Job Posted Successfully! AI is now ranking candidates.");
            navigate('/recruiter-dashboard');
        } catch (error) {
            console.error("Failed to post job:", error);
            alert("Error posting job. Are you logged in?");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <DashboardLayout role="recruiter">
            <h1 style={{ marginBottom: '3rem' }}>Post a New Job</h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '3rem', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><Briefcase size={16} /> Job Title</label>
                            <input type="text" className="form-control" placeholder="e.g. Senior PHP Developer" required />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Job Description</label>
                            <textarea className="form-control" rows="5" placeholder="Describe the role and responsibilities..." required></textarea>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><ListChecks size={16} /> Required Skills (comma separated)</label>
                            <input name="skills" type="text" className="form-control" placeholder="React, Node.js, AWS, Tailwind" value={formData.skills} onChange={handleChange} required />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><DollarSign size={16} /> Salary Range</label>
                            <input name="salary_range" type="text" className="form-control" placeholder="e.g. 50k - 80k BDT" value={formData.salary_range} onChange={handleChange} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><MapPin size={16} /> Location</label>
                            <input name="location" type="text" className="form-control" placeholder="e.g. Dhaka, Remote" value={formData.location} onChange={handleChange} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Job Type</label>
                            <select name="job_type" className="form-control" style={{ background: '#0f172a' }} value={formData.job_type} onChange={handleChange}>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Remote</option>
                                <option>Internship</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Publishing..." : "Publish Job Listing"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </DashboardLayout>
    );
};

export default PostJobPage;
