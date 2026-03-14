const STEP_LABELS = ['Agenda', 'Problema', 'Decisão', 'Ação'];

export function MeetingFlowController({ meeting, onSubmitProblem, onSubmitDecision, onSubmitAction, onNextAgenda }) {
  const currentAgenda = meeting.agendas[meeting.currentAgendaIndex || 0];
  const currentStep = meeting.currentStep || 0;

  const chips = STEP_LABELS.map((label, index) => `<span class="step-chip ${index === currentStep ? 'active' : ''}">${label}</span>`).join('');

  return `
    <div>
      <div><strong>Agenda ${Math.min((meeting.currentAgendaIndex || 0) + 1, meeting.agendas.length)} of ${meeting.agendas.length}</strong></div>
      <div><small>Step ${currentStep + 1} of 4</small></div>
      <div class="step-indicator">${chips}</div>
      <article class="block"><strong>CurrentAgenda</strong><div>${currentAgenda.title}</div></article>
      ${renderStepForm(currentStep, onSubmitProblem, onSubmitDecision, onSubmitAction, onNextAgenda)}
    </div>
  `;
}

function renderStepForm(step, onSubmitProblem, onSubmitDecision, onSubmitAction, onNextAgenda) {
  if (step === 1) {
    return `<div><h4>ProblemStep</h4><input id="problemInput" placeholder="Descreva o problema" /><button id="problemBtn">Registrar problema</button></div>`;
  }
  if (step === 2) {
    return `<div><h4>DecisionStep</h4><input id="decisionInput" placeholder="Descreva a decisão" /><button id="decisionBtn">Registrar decisão</button></div>`;
  }
  if (step === 3) {
    return `<div><h4>ActionStep</h4><input id="actionInput" placeholder="Defina a ação" /><input id="responsibleInput" placeholder="Responsáveis (separados por vírgula)" /><input id="deadlineInput" placeholder="Prazo (YYYY-MM-DD)" /><button id="actionBtn">Criar ação</button><button id="nextAgendaBtn">Next Agenda</button></div>`;
  }

  return `<div><small>Inicie a pauta atual para registrar o fluxo guiado.</small><br /><button id="goProblemBtn">Iniciar pauta</button></div>`;
}

export function bindMeetingFlowEvents({ onSubmitProblem, onSubmitDecision, onSubmitAction, onNextAgenda, onGoProblem }) {
  const pBtn = document.getElementById('problemBtn');
  const dBtn = document.getElementById('decisionBtn');
  const aBtn = document.getElementById('actionBtn');
  const nBtn = document.getElementById('nextAgendaBtn');
  const gBtn = document.getElementById('goProblemBtn');

  if (gBtn) gBtn.onclick = onGoProblem;
  if (pBtn) pBtn.onclick = () => onSubmitProblem(document.getElementById('problemInput').value);
  if (dBtn) dBtn.onclick = () => onSubmitDecision(document.getElementById('decisionInput').value);
  if (aBtn)
    aBtn.onclick = () =>
      onSubmitAction({
        title: document.getElementById('actionInput').value,
        responsibles: document.getElementById('responsibleInput').value.split(',').map((item) => item.trim()).filter(Boolean),
        deadline: document.getElementById('deadlineInput').value,
      });
  if (nBtn) nBtn.onclick = onNextAgenda;
}
