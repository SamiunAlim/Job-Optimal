import React, { useState, useEffect } from 'react';
import { Award, Timer, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { saveAssessmentScore } from '../api';

const Assessments = () => {
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [saving, setSaving] = useState(false);

    const questions = [
        { q: "What is the correct syntax for an arrow function in JS?", options: ["() => {}", "function() =>", "=> {}", "let func = {}"], correct: 0 },
        { q: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], correct: 1 },
        { q: "What does SQL stand for?", options: ["Strong Question Language", "Structured Query Language", "Simple Quality Level", "Styled Query Logic"], correct: 1 },
        { q: "What is the Big O complexity of searching in a Hash Map (Average Case)?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correct: 2 },
        { q: "Which CSS property is used to create a flex container?", options: ["display: grid", "display: flex", "flex-direction: row", "align-items: center"], correct: 1 },
        { q: "What is the purpose of 'virtual DOM' in React?", options: ["To store data in browser", "To improve rendering performance", "To replace real DOM entirely", "To handle API calls"], correct: 1 },
        { q: "Which keyword is used to declare an immutable variable in Modern JS?", options: ["var", "let", "const", "fixed"], correct: 2 },
        { q: "In HTTP, which method is used to UPDATE a resource entirely?", options: ["GET", "POST", "PUT", "PATCH"], correct: 2 },
        { q: "What does the 'npm' stand for?", options: ["Node Project Manager", "New Package Management", "Node Package Manager", "Network Protocol Method"], correct: 2 },
        { q: "Which of the following is NOT a JavaScript framework?", options: ["React", "Vue", "Angular", "Python"], correct: 3 }
    ];

    useEffect(() => {
        let timer;
        if (started && timeLeft > 0 && !finished) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setFinished(true);
        }
        return () => clearInterval(timer);
    }, [started, timeLeft, finished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswer = async (index) => {
        let finalScore = score;
        if (index === questions[currentQuestion].correct) {
            finalScore = score + 1;
            setScore(finalScore);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setFinished(true);
            await saveResult(finalScore);
        }
    };

    const saveResult = async (finalScore) => {
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const percent = Math.round((finalScore / questions.length) * 100);
            await saveAssessmentScore({
                user_id: user.id,
                score: percent,
                category: 'Frontend Development'
            });
        } catch (error) {
            console.error("Error saving score:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout role="candidate">
            <h1 style={{ marginBottom: '3rem' }}>AI Skill Assessment Center</h1>

            {!started ? (
                <motion.div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                    <BrainCircuit size={64} style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Fullstack Developer Proficiency Quiz</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Prove your skills and boost your Matching Score by 15%. This result will be visible to Top Recruiters.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>{questions.length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Questions</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>5:00</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>Adaptive</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Difficulty</div>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setStarted(true)} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Begin Certification</button>
                </motion.div>
            ) : !finished ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="glass" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div style={{ color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'white', fontWeight: 700 }}>Question {currentQuestion + 1}</span> of {questions.length}
                            </div>
                            <div className="glass" style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: timeLeft < 60 ? '#ef4444' : 'var(--secondary-color)' }}>
                                <Timer size={18} /> <span style={{ fontWeight: 700 }}>{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '3rem', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                style={{ height: '100%', background: 'var(--primary-color)' }}
                            />
                        </div>

                        <h2 style={{ marginBottom: '2.5rem', lineHeight: '1.4' }}>{questions[currentQuestion].q}</h2>
                        <div style={{ display: 'grid', gap: '1.2rem' }}>
                            {questions[currentQuestion].options.map((opt, i) => (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    key={i}
                                    className="btn glass"
                                    style={{ textAlign: 'left', padding: '1.5rem', justifyContent: 'flex-start', fontSize: '1.1rem', borderColor: 'var(--glass-border)' }}
                                    onClick={() => handleAnswer(i)}
                                >
                                    <span style={{ color: 'var(--primary-color)', marginRight: '1rem', fontWeight: 800 }}>{String.fromCharCode(65 + i)}</span>
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '5rem', textAlign: 'center' }}>
                    <Award size={80} style={{ color: '#fbbf24', marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Certification Result</h2>
                    <div style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>{Math.round((score / questions.length) * 100)}%</div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                        {score >= 7 ? "Outstanding! You've ranked in the top 10% of candidates." : "Good effort! Your profile has been updated with these skills."}
                    </p>

                    <div className="glass" style={{ padding: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <CheckCircle2 size={24} color="var(--secondary-color)" />
                        <span>{saving ? 'Syncing with Recruitment Database...' : 'Verified & Saved to your Profile'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <button className="btn glass" onClick={() => window.location.href = '/candidate-dashboard'}>Back to Dashboard</button>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retake Test</button>
                    </div>
                </motion.div>
            )}
        </DashboardLayout>
    );
};

export default Assessments;
