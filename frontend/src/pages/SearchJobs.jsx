import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Wallet, Bot, Send, X, Sparkles, Zap, MessageSquare, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { getJobs, aiChat, aiSmartMatch, getCandidateProfile } from '../api';

const SearchJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: 'bot', content: "Hello! I'm your AI Career Copilot. I can help you find job requirements, filter by salary, or find matching links. What are you looking for today?" }
    ]);
    const [userInput, setUserInput] = useState("");
    const [selectedJobForMatch, setSelectedJobForMatch] = useState(null);
    const [isMatching, setIsMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const originalInput = userInput;
        const newMessages = [...chatMessages, { role: 'user', content: originalInput }];
        setChatMessages(newMessages);
        setUserInput("");
        setChatMessages(prev => [...prev, { role: 'bot', content: "..." }]);

        try {
            const response = await aiChat(originalInput);
            const botReply = response.data.reply;
            setChatMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'bot', content: botReply };
                return updated;
            });
        } catch (error) {
            setChatMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'bot', content: "I'm having trouble thinking right now. Please check if your backend is running." };
                return updated;
            });
        }
    };

    const handleSmartMatch = async (job) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return alert("Please log in first");

        setSelectedJobForMatch(job);
        setIsMatching(true);
        setMatchResult(null);

        try {
            // 1. Fetch user's profile
            const profileRes = await getCandidateProfile(user.id);
            const skillsArray = profileRes.data.skills || [];
            const resumeText = `Skills: ${skillsArray.map(s => s.skill_name).join(", ")}. Bio: ${profileRes.data.bio || ""}`;

            // 2. Call AI Match
            const response = await aiSmartMatch(resumeText || "No skills found in profile", job.description);
            setMatchResult(response.data);
        } catch (error) {
            console.error("Matching Error:", error);
            alert("Could not complete AI matching. Ensure your AI API Keys are configured.");
        } finally {
            setIsMatching(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="candidate">
            <div style={{ display: 'grid', gridTemplateColumns: isCopilotOpen ? '1fr 350px' : '1fr', gap: '2rem', transition: '0.3s' }}>

                {/* Job List Area */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h1>Smart Job Matches <Sparkles size={24} color="var(--secondary-color)" style={{ display: 'inline', marginLeft: '10px' }} /></h1>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Search size={18} color="var(--text-secondary)" />
                                <input
                                    type="text"
                                    placeholder="Search skills, titles..."
                                    className="form-control"
                                    style={{ width: '250px', background: 'transparent', border: 'none', outline: 'none' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className={`btn ${isCopilotOpen ? 'btn-primary' : 'glass'}`}
                                onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Bot size={20} /> {isCopilotOpen ? 'Close AI' : 'AI Copilot'}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '5rem' }}>
                                <div className="loader" style={{ margin: '0 auto' }}></div>
                                <p style={{ marginTop: '1rem' }}>Fetching real-time job matches...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileHover={{ translateY: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass job-card"
                                    style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0 }}>{job.title}</h3>
                                            {job.match_score > 90 && <span className="badge" style={{ background: 'var(--secondary-color)', color: 'black', fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>AI RECOMMEND</span>}
                                        </div>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.8rem' }}>{job.company_name || "Enterprise Partner"}</p>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {job.location}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Wallet size={14} /> {job.salary_range}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '1.2rem' }}>{job.match_score || 85}%</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>System Match</div>
                                        </div>
                                        <button onClick={() => handleSmartMatch(job)} className="btn glass" style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                                            <Brain size={18} style={{ marginRight: '8px' }} /> Smart Match
                                        </button>
                                        <button className="btn btn-primary">Apply Now</button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem' }}>
                                <h3>No matching jobs found.</h3>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Copilot Side Chat */}
                <AnimatePresence>
                    {isCopilotOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="glass"
                            style={{ height: 'calc(100vh - 6rem)', display: 'flex', flexDirection: 'column', border: '1px solid var(--primary-color)', position: 'sticky', top: '3rem' }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Bot size={24} color="var(--primary-color)" />
                                    <span style={{ fontWeight: 700 }}>Career Copilot</span>
                                </div>
                                <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsCopilotOpen(false)} />
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '10px', maxWidth: '85%', fontSize: '0.9rem' }}>
                                        {msg.content}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                                <input type="text" className="form-control" placeholder="Ask AI..." value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                                <button className="btn btn-primary"><Send size={18} /></button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Match Modal Overlay */}
                <AnimatePresence>
                    {selectedJobForMatch && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass"
                                style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}
                            >
                                <button onClick={() => setSelectedJobForMatch(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>

                                {isMatching ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div className="loader" style={{ margin: '0 auto 2rem' }}></div>
                                        <h2>AI is Analyzing Compatibility...</h2>
                                        <p style={{ color: 'var(--text-secondary)' }}>Comparing your skills with {selectedJobForMatch.title} requirements.</p>
                                    </div>
                                ) : matchResult ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <h2>AI Match Analysis</h2>
                                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary-color)' }}>{matchResult.matchScore}%</div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                                            <section>
                                                <h4 style={{ color: 'var(--secondary-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} /> Strengths</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {matchResult.strengths?.map(s => <span key={s} className="glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}>{s}</span>)}
                                                </div>
                                            </section>

                                            <section>
                                                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={16} /> Skill Gaps</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {matchResult.missingSkills?.map(s => <span key={s} className="glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{s}</span>)}
                                                </div>
                                            </section>

                                            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)' }}>
                                                <h4 style={{ marginBottom: '0.5rem' }}>AI Advice</h4>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{matchResult.advice}</p>
                                            </div>
                                        </div>

                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', height: '50px' }}>Apply Based on AI Tips</button>
                                    </div>
                                ) : null}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>

            <style>{`.loader{border:4px solid rgba(255,255,255,.1);border-top:4px solid var(--primary-color);border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </DashboardLayout>
    );
};

export default SearchJobs;
