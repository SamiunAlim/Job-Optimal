import React, { useState, useEffect } from 'react';
import { User, Mail, Bell, Shield, Camera, Save, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { getProfile, updateProfile } from '../api';

const SettingsPage = () => {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('candidate');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        bio: '',
        location: '',
        company_name: '',
        password: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    const response = await getProfile(storedUser.id);
                    const data = response.data;
                    setUserRole(data.role);
                    setFormData({
                        full_name: data.full_name || '',
                        email: data.email || '',
                        bio: data.extraInfo?.bio || '',
                        location: data.extraInfo?.location || data.extraInfo?.company_location || '',
                        company_name: data.extraInfo?.company_name || '',
                        password: ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await updateProfile({
                user_id: storedUser.id,
                ...formData
            });
            setSaved(true);

            // Update local storage if name changed
            const updatedUser = { ...storedUser, name: formData.full_name };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Trigger UI refresh for sidebar/greeting
            window.dispatchEvent(new Event('storage'));

            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <DashboardLayout role={userRole}><p>Loading settings...</p></DashboardLayout>;

    return (
        <DashboardLayout role={userRole}>
            <h1>Account Settings</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '3rem' }}>
                {/* Sidebar Nav (Internal) */}
                <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <nav style={{ display: 'grid', gap: '0.5rem' }}>
                        <SettingsLink icon={<User size={18} />} text="Profile Info" active />
                        <SettingsLink icon={<Bell size={18} />} text="Notifications" />
                        <SettingsLink icon={<Shield size={18} />} text="Privacy & Security" />
                    </nav>
                </div>

                {/* Main Content */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '100px', height: '100px', background: 'var(--primary-color)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '2rem', fontWeight: 800 }}>
                                {formData.full_name?.charAt(0) || 'U'}
                            </div>
                            <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}><Camera size={16} /></button>
                        </div>
                        <div>
                            <h3>{formData.full_name}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {userRole === 'candidate' ? 'Professional Candidate' : formData.company_name} • {formData.location || 'Location not set'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                            <input name="full_name" type="text" className="form-control" value={formData.full_name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address (Ready Only)</label>
                            <input type="email" className="form-control" value={formData.email} disabled style={{ opacity: 0.6 }} />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>New Password (Leave blank to keep same)</label>
                            <input name="password" type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                        </div>

                        {userRole === 'recruiter' && (
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company Name</label>
                                <input name="company_name" type="text" className="form-control" value={formData.company_name} onChange={handleChange} />
                            </div>
                        )}

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><MapPin size={14} /> Location</label>
                            <input name="location" type="text" className="form-control" value={formData.location} onChange={handleChange} placeholder="e.g. Dhaka, BD" />
                        </div>

                        {userRole === 'candidate' && (
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Professional Bio</label>
                                <textarea name="bio" className="form-control" rows="3" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..."></textarea>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary"><Save size={18} /> Save Changes</button>
                            {saved && <span style={{ color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> Settings updated!</span>}
                        </div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

const SettingsLink = ({ icon, text, active }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        cursor: 'pointer',
        borderRadius: '8px',
        color: active ? 'white' : 'var(--text-secondary)',
        background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    }}>
        {icon} <span>{text}</span>
    </div>
);

export default SettingsPage;
