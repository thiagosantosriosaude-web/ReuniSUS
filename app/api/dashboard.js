const express = require('express');
const { getDashboardMetrics } = require('../services/meetingService');

const router = express.Router();

router.get('/metrics', (_req, res) => {
  res.json(getDashboardMetrics());
});

module.exports = router;
