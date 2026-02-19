const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);

// Serve frontend static files in production
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuild));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
