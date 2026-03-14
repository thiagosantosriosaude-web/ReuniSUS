const express = require('express');
const {
  addAction,
  addProblem,
  getMeetingSummary,
  setActionStatus,
  setDecision,
  startMeeting,
} = require('../services/meetingService');

const router = express.Router();

router.get('/:meetingId', (req, res) => {
  try {
    res.json(getMeetingSummary(req.params.meetingId));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/:meetingId/start', (req, res) => {
  try {
    res.json(startMeeting(req.params.meetingId));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/:meetingId/agendas/:agendaId/problems', (req, res) => {
  try {
    const problem = addProblem({
      meetingId: req.params.meetingId,
      agendaId: req.params.agendaId,
      description: req.body.description,
    });
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:meetingId/agendas/:agendaId/decision', (req, res) => {
  try {
    const decision = setDecision({
      meetingId: req.params.meetingId,
      agendaId: req.params.agendaId,
      summary: req.body.summary,
    });
    res.status(201).json(decision);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:meetingId/agendas/:agendaId/actions', (req, res) => {
  try {
    const action = addAction({
      meetingId: req.params.meetingId,
      agendaId: req.params.agendaId,
      title: req.body.title,
      responsibles: req.body.responsibles || [],
      deadline: req.body.deadline || null,
    });
    res.status(201).json(action);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:meetingId/agendas/:agendaId/actions/:actionId', (req, res) => {
  try {
    const action = setActionStatus({
      meetingId: req.params.meetingId,
      agendaId: req.params.agendaId,
      actionId: req.params.actionId,
      completed: Boolean(req.body.completed),
    });
    res.json(action);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
