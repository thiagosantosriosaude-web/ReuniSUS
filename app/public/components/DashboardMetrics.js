export function renderDashboardMetrics(container, metrics) {
  container.innerHTML = `
    <div class="metric-grid">
      <div class="metric"><small>Meetings held</small><div>${metrics.meetingsHeld}</div></div>
      <div class="metric"><small>Problems discussed</small><div>${metrics.problemsDiscussed}</div></div>
      <div class="metric"><small>Decisions taken</small><div>${metrics.decisionsTaken}</div></div>
      <div class="metric"><small>Actions created</small><div>${metrics.actionsCreated}</div></div>
      <div class="metric"><small>Execution rate</small><div>${Math.round(metrics.executionRate * 100)}%</div></div>
    </div>
  `;
}
