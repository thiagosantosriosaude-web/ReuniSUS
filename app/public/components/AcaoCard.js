export function AcaoCard(action) {
  return `<article class="block action"><strong>Ação</strong><div>${action.title}</div><small>Responsáveis: ${action.responsibles.join(', ') || 'não definido'} • Prazo: ${action.deadline || 'não definido'}</small></article>`;
}
