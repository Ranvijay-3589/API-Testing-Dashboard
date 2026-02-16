const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const requestRoutes = require('./routes/request.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);

app.use(errorHandler);

module.exports = app;
