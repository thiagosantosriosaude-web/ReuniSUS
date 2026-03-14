import { DecisionBlock } from './components/DecisionBlock.js';
import { MeetingFlowController, bindMeetingFlowEvents } from './components/MeetingFlowController.js';
import { renderTimeline } from './components/Timeline.js';
import { renderDashboardMetrics } from './components/DashboardMetrics.js';

const meetingId = 'meeting-1';
const flowState = { enabled: false, currentAgendaIndex: 0, currentStep: 0 };

const metricsEl = document.getElementById('metrics');
const meetingFlowEl = document.getElementById('meetingFlow');
const decisionBlocksEl = document.getElementById('decisionBlocks');
const timelineEl = document.getElementById('timeline');
const startBtn = document.getElementById('startMeetingBtn');

let meetingData = null;

async function api(path, options) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return response.json();
}

async function load() {
  meetingData = await api(`/api/meetings/${meetingId}`);
  const metrics = await api('/api/dashboard/metrics');
  renderDashboardMetrics(metricsEl, metrics);
  renderDecisionBlocks();
  renderTimeline(timelineEl, meetingData.timeline);
  renderFlow();
}

function currentAgenda() {
  return meetingData.agendas[flowState.currentAgendaIndex];
}

function renderDecisionBlocks() {
  decisionBlocksEl.innerHTML = meetingData.agendas.map((agenda) => DecisionBlock(agenda)).join('');
}

function renderFlow() {
  if (!flowState.enabled) {
    meetingFlowEl.innerHTML = '<small>Clique em Start Meeting para iniciar o modo de condução guiada.</small>';
    return;
  }

  meetingFlowEl.innerHTML = MeetingFlowController({
    meeting: { ...meetingData, ...flowState },
  });

  bindMeetingFlowEvents({
    onGoProblem: () => {
      flowState.currentStep = 1;
      renderFlow();
    },
    onSubmitProblem: async (description) => {
      if (!description) return;
      await api(`/api/meetings/${meetingId}/agendas/${currentAgenda().id}/problems`, { method: 'POST', body: JSON.stringify({ description }) });
      flowState.currentStep = 2;
      await load();
    },
    onSubmitDecision: async (summary) => {
      if (!summary) return;
      await api(`/api/meetings/${meetingId}/agendas/${currentAgenda().id}/decision`, { method: 'POST', body: JSON.stringify({ summary }) });
      flowState.currentStep = 3;
      await load();
    },
    onSubmitAction: async ({ title, responsibles, deadline }) => {
      if (!title) return;
      await api(`/api/meetings/${meetingId}/agendas/${currentAgenda().id}/actions`, {
        method: 'POST',
        body: JSON.stringify({ title, responsibles, deadline }),
      });
      await load();
    },
    onNextAgenda: () => {
      if (flowState.currentAgendaIndex < meetingData.agendas.length - 1) {
        flowState.currentAgendaIndex += 1;
        flowState.currentStep = 0;
      }
      renderFlow();
    },
  });
}

startBtn.onclick = async () => {
  await api(`/api/meetings/${meetingId}/start`, { method: 'POST' });
  flowState.enabled = true;
  flowState.currentAgendaIndex = 0;
  flowState.currentStep = 0;
  await load();
};

load();
