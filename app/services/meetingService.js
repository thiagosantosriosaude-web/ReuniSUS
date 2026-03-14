const { randomUUID } = require('crypto');
const store = require('../data/store');

function getMeeting(meetingId) {
  return store.meetings.find((meeting) => meeting.id === meetingId);
}

function assertMeeting(meetingId) {
  const meeting = getMeeting(meetingId);
  if (!meeting) throw new Error('Meeting not found');
  return meeting;
}

function getAgenda(meeting, agendaId) {
  return meeting.agendas.find((agenda) => agenda.id === agendaId);
}

function pushTimeline(meeting, type, description, agendaId) {
  meeting.timeline.push({
    id: randomUUID(),
    type,
    description,
    agendaId,
    timestamp: new Date().toISOString(),
  });
}

function startMeeting(meetingId) {
  const meeting = assertMeeting(meetingId);
  meeting.status = 'in_progress';
  return meeting;
}

function addProblem({ meetingId, agendaId, description }) {
  const meeting = assertMeeting(meetingId);
  const agenda = getAgenda(meeting, agendaId);
  if (!agenda) throw new Error('Agenda not found');

  const problem = { id: randomUUID(), description, createdAt: new Date().toISOString() };
  agenda.problems.push(problem);
  pushTimeline(meeting, 'problem_created', 'Problema registrado', agendaId);
  return problem;
}

function setDecision({ meetingId, agendaId, summary }) {
  const meeting = assertMeeting(meetingId);
  const agenda = getAgenda(meeting, agendaId);
  if (!agenda) throw new Error('Agenda not found');

  const decision = { id: randomUUID(), summary, createdAt: new Date().toISOString() };
  agenda.decision = decision;
  pushTimeline(meeting, 'decision_created', 'Decisão tomada', agendaId);
  return decision;
}

function addAction({ meetingId, agendaId, title, responsibles, deadline }) {
  const meeting = assertMeeting(meetingId);
  const agenda = getAgenda(meeting, agendaId);
  if (!agenda) throw new Error('Agenda not found');

  const action = {
    id: randomUUID(),
    title,
    responsibles,
    deadline,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  agenda.actions.push(action);
  pushTimeline(meeting, 'action_created', 'Ação criada', agendaId);
  return action;
}

function setActionStatus({ meetingId, agendaId, actionId, completed }) {
  const meeting = assertMeeting(meetingId);
  const agenda = getAgenda(meeting, agendaId);
  if (!agenda) throw new Error('Agenda not found');
  const action = agenda.actions.find((item) => item.id === actionId);
  if (!action) throw new Error('Action not found');
  action.completed = completed;
  return action;
}

function getDashboardMetrics() {
  const meetingsHeld = store.meetings.length;
  const problemsDiscussed = store.meetings.reduce((acc, meeting) => acc + meeting.agendas.reduce((sum, agenda) => sum + agenda.problems.length, 0), 0);
  const decisionsTaken = store.meetings.reduce((acc, meeting) => acc + meeting.agendas.reduce((sum, agenda) => sum + (agenda.decision ? 1 : 0), 0), 0);
  const allActions = store.meetings.flatMap((meeting) => meeting.agendas.flatMap((agenda) => agenda.actions));
  const actionsCreated = allActions.length;
  const completedActions = allActions.filter((action) => action.completed).length;
  const executionRate = actionsCreated === 0 ? 0 : completedActions / actionsCreated;

  return {
    meetingsHeld,
    problemsDiscussed,
    decisionsTaken,
    actionsCreated,
    executionRate,
  };
}

function getAtaGenerationPayload(meetingId) {
  const meeting = assertMeeting(meetingId);

  return {
    context: {
      meetingId: meeting.id,
      title: meeting.title,
      status: meeting.status,
      createdAt: meeting.createdAt,
    },
    agendasDiscussed: meeting.agendas.map((agenda) => ({
      agendaId: agenda.id,
      title: agenda.title,
    })),
    problemsIdentified: meeting.agendas.flatMap((agenda) =>
      agenda.problems.map((problem) => ({
        agendaId: agenda.id,
        agendaTitle: agenda.title,
        problemId: problem.id,
        description: problem.description,
      })),
    ),
    decisionsTaken: meeting.agendas
      .filter((agenda) => Boolean(agenda.decision))
      .map((agenda) => ({
        agendaId: agenda.id,
        agendaTitle: agenda.title,
        decisionId: agenda.decision.id,
        summary: agenda.decision.summary,
      })),
    actionPlan: meeting.agendas.flatMap((agenda) =>
      agenda.actions.map((action) => ({
        agendaId: agenda.id,
        agendaTitle: agenda.title,
        actionId: action.id,
        title: action.title,
        responsibles: action.responsibles,
        deadline: action.deadline,
        completed: action.completed,
      })),
    ),
  };
}

function getMeetingSummary(meetingId) {
  return assertMeeting(meetingId);
}

module.exports = {
  addAction,
  addProblem,
  getAtaGenerationPayload,
  getDashboardMetrics,
  getMeetingSummary,
  setActionStatus,
  setDecision,
  startMeeting,
};
