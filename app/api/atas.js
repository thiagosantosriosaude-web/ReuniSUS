const express = require('express');
const { getAtaGenerationPayload } = require('../services/meetingService');

const router = express.Router();

router.post('/generate', (req, res) => {
  try {
    const payload = getAtaGenerationPayload(req.body.meetingId);
    res.json(payload);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
