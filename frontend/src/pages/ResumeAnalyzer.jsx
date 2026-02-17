import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Brain, ArrowRight, FileSearch, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { uploadResume } from '../api';

const ResumeAnalyzer = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        console.log("Input Change Event - File:", selectedFile);

        if (!selectedFile) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert("Session expired. Please login again to upload files.");
            return;
        }

        const user = JSON.parse(userStr);
        setFileName(selectedFile.name);
        setAnalyzing(true);
        setProgress(15);

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('user_id', user.id);

        try {
            // Visual feedback loop
            const interval = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 3 : 90));
            }, 150);

            console.log("Starting upload for:", selectedFile.name);
            const response = await uploadResume(formData);
            console.log("Upload Success:", response.data);

            clearInterval(interval);
            setProgress(100);

            setTimeout(() => {
                setAnalyzing(false);
                setResult(response.data);
            }, 600);

        } catch (error) {
            console.error("Upload process failed:", error);
            alert("File upload failed. Our AI server might be busy or the file format is invalid. Ensure you are uploading a PDF or DOCX.");
            setAnalyzing(false);
            setProgress(0);
        }
    };

    const triggerUpload = (e) => {
        // Prevent event bubbling if necessary and trigger click
        if (e) e.preventDefault();
        console.log("Triggering file selection dialog...");
        fileInputRef.current.click();
    };

    return (
        <DashboardLayout role="candidate">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>AI Resume Intelligence</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Our Neural Engine analyzes your resume against 50,000+ job descriptions to optimize your visibility.</p>
                </header>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <AnimatePresence mode='wait'>
                    {!result && !analyzing && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="glass"
                            whileHover={{ scale: 1.01 }}
                            style={{ padding: '5rem', textAlign: 'center', border: '2px dashed var(--glass-border)', cursor: 'pointer' }}
                            onClick={triggerUpload}
                        >
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 2rem' }}>
                                <UploadCloud size={48} style={{ color: 'var(--primary-color)' }} />
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>Drop your CV here or click to upload</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Supports PDF, DOCX (Max 10MB)</p>
                            <button type="button" className="btn btn-primary" onClick={triggerUpload} style={{ padding: '1rem 3rem' }}>Select Files</button>
                        </motion.div>
                    )}

                    {analyzing && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass"
                            style={{ padding: '5rem', textAlign: 'center' }}
                        >
                            <div className="pulse-loader" style={{ marginBottom: '2rem' }}>
                                <FileSearch size={64} style={{ color: 'var(--primary-color)' }} />
                            </div>
                            <h2 style={{ marginBottom: '1.5rem' }}>Analyzing: {fileName}</h2>
                            <div style={{ width: '100%', maxWidth: '400px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
                                <motion.div
                                    className="progress-bar"
                                    animate={{ width: `${progress}%` }}
                                    style={{ height: '100%', background: 'var(--primary-color)', boxShadow: '0 0 15px var(--primary-color)' }}
                                />
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>Processing tokens and extracting meta-data... {progress}%</p>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}
                        >
                            {/* Left Column: Score */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Overall ATS Score</div>
                                    <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--secondary-color)', lineHeight: 1 }}>{result.score}</div>
                                    <div style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700 }}>
                                        {result.matchRate} Match Rate
                                    </div>
                                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzed File: <br /><strong>{result.fileName}</strong></p>
                                </div>

                                <div className="glass" style={{ padding: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><BarChart size={18} /> Performance Metrics</h3>
                                    <MetricBar label="Relevance" value={result.atsHeatmap[0]} />
                                    <MetricBar label="Readability" value={result.atsHeatmap[1]} />
                                    <MetricBar label="Formatting" value={result.atsHeatmap[2]} />
                                    <MetricBar label="Impact Keywords" value={result.atsHeatmap[3]} />
                                </div>
                            </div>

                            {/* Right Column: Insights */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="glass" style={{ padding: '2.5rem' }}>
                                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><CheckCircle size={22} color="var(--secondary-color)" /> Extracted Skill Profile</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        {result.extractedSkills.map(skill => (
                                            <span key={skill} className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass" style={{ padding: '2.5rem' }}>
                                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Brain size={22} color="var(--primary-color)" /> Strategic Insights</h3>
                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        {result.insights.map((insight, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '1.2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                                <div style={{ marginTop: '4px' }}>
                                                    {insight.type === 'strength' ? <CheckCircle size={18} color="var(--secondary-color)" /> : <ArrowRight size={18} color="var(--primary-color)" />}
                                                </div>
                                                <p style={{ color: insight.type === 'strength' ? 'white' : 'var(--text-secondary)' }}>{insight.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={() => setResult(null)} style={{ alignSelf: 'flex-start' }}>Analyze New CV</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .pulse-loader {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </DashboardLayout>
    );
};

const MetricBar = ({ label, value }) => (
    <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
            <div style={{ height: '100%', width: `${value}%`, background: value > 80 ? 'var(--secondary-color)' : 'var(--primary-color)', borderRadius: '10px' }} />
        </div>
    </div>
);

export default ResumeAnalyzer;
