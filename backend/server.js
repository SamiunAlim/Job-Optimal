const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const assessmentRoutes = require('./routes/assessments');
const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 8081;

// Socket logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Attach io to request for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Job Optimal AI API is running with Mobile Socket support...');
});

http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Connect via mobile using your computer's IP!`);
});
