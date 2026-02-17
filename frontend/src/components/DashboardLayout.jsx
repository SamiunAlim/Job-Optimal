import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Search, FileText, Award,
    Settings, LogOut, ShieldCheck, PlusCircle,
    Users, BarChart3, User
} from 'lucide-react';

const DashboardLayout = ({ children, role = 'candidate' }) => {
    const location = useLocation();
    const [userData, setUserData] = useState({ name: 'User', role: role });

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            }
        };

        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const candidateLinks = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/candidate-dashboard" },
        { icon: <Search size={20} />, text: "Search Jobs", to: "/search-jobs" },
        { icon: <FileText size={20} />, text: "Resume Analyzer", to: "/resume-analyzer" },
        { icon: <Award size={20} />, text: "Assessments", to: "/assessments" },
        { icon: <ShieldCheck size={20} />, text: "Fraud Shield", to: "/fraud-shield" },
        { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
    ];

    const recruiterLinks = [
        { icon: <LayoutDashboard size={20} />, text: "Overview", to: "/recruiter-dashboard" },
        { icon: <PlusCircle size={20} />, text: "Post a Job", to: "/post-job" },
        { icon: <Users size={20} />, text: "Candidates", to: "/recruiter-dashboard" },
        { icon: <BarChart3 size={20} />, text: "Analytics", to: "/recruiter-dashboard" },
        { icon: <ShieldCheck size={20} />, text: "Verifications", to: "/verify" },
        { icon: <Settings size={20} />, text: "Settings", to: "/settings" },
    ];

    const handleLogout = () => {
        localStorage.clear();
    };

    const links = role === 'candidate' ? candidateLinks : recruiterLinks;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '280px',
                background: 'rgba(30, 41, 59, 1)',
                borderRight: '1px solid var(--glass-border)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh'
            }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="logo" style={{ marginBottom: '3rem', cursor: 'pointer' }}>JOB OPTIMAL</div>
                </Link>
                <nav style={{ flex: 1 }}>
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            to={link.to}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                color: location.pathname === link.to ? 'white' : 'var(--text-secondary)',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                background: location.pathname === link.to ? 'var(--primary-color)' : 'transparent',
                                transition: '0.3s'
                            }}
                        >
                            {link.icon}
                            <span>{link.text}</span>
                        </Link>
                    ))}
                </nav>
                <div style={{ marginTop: 'auto', marginBottom: '1.5rem' }}>
                    <div className="glass" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ width: '35px', height: '35px', background: 'var(--primary-color)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '0.9rem', fontWeight: 800 }}>
                            {userData.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{userData.role} Account</div>
                        </div>
                    </div>
                    <Link to="/login" onClick={handleLogout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        color: '#ef4444',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        transition: '0.3s'
                    }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            <main style={{
                flex: 1,
                padding: '3rem',
                marginLeft: '280px',
                minHeight: '100vh',
                background: 'var(--bg-dark)'
            }}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
