const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize AI Clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');

// --- 1. AI CHAT AGENT ---
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const [jobs] = await db.execute('SELECT title, location, salary_range FROM jobs LIMIT 5');
        const jobContext = jobs.map(j => `${j.title} in ${j.location}`).join(', ');

        let reply = "";

        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an AI Career Agent for Job Optimal. Live Jobs: ${jobContext}. User: ${message}`;
            const result = await model.generateContent(prompt);
            reply = result.response.text();
        } else if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('YOUR_OPENAI')) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `You are an AI Career Agent for Job Optimal. Live Jobs: ${jobContext}` },
                    { role: "user", content: message }
                ],
            });
            reply = response.choices[0].message.content;
        } else {
            const jobTitles = jobs.map(j => j.title).join(", ");
            reply = `👋 Hi! I'm in **Preview Mode**. I see we have roles like **${jobTitles}** available! 

To unlock my full "Brain Power" (GPT-4/Gemini), please add your API Key in the \`.env\` file. But I can still help you navigate the site!`;
        }

        res.json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "AI is resting. Try again soon!" });
    }
});

// --- 2. SMART JOB MATCHING ---
router.post('/smart-match', async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "Missing resume or job data" });
    }

    try {
        const prompt = `Analyze the compatibility between this Resume and Job Description.
        Resume: ${resumeText.substring(0, 2000)}
        Job: ${jobDescription.substring(0, 1000)}
        
        Return a JSON object with:
        - matchScore (0-100)
        - strengths (array of strings)
        - missingSkills (array of strings)
        - advice (string)`;

        let resultText = "";

        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            resultText = result.response.text();
        } else if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('YOUR_OPENAI')) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            });
            resultText = response.choices[0].message.content;
        } else {
            return res.json({
                matchScore: 75,
                strengths: ["Matching Title", "Experience Found"],
                missingSkills: ["Connect AI Key for better detection"],
                advice: "You look like a solid candidate!"
            });
        }

        // Try to parse JSON from AI response
        const jsonMatch = resultText.match(/\{.*\}/s);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { advice: resultText };

        res.json(analysis);

    } catch (error) {
        console.error("Match Error:", error);
        res.status(500).json({ error: "Matching failed" });
    }
});

module.exports = router;
