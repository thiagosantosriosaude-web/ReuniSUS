const express = require('express');
const cors = require('cors');
const path = require('path');

const meetingRoutes = require('./api/meetings');
const atasRoutes = require('./api/atas');
const dashboardRoutes = require('./api/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/meetings', meetingRoutes);
app.use('/api/atas', atasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ReuniSUS running on port ${PORT}`);
});
