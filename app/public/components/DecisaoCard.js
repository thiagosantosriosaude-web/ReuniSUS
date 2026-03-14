export function DecisaoCard(decision) {
  if (!decision) return '<article class="block decision"><strong>Decisão</strong><div><small>Aguardando registro</small></div></article>';
  return `<article class="block decision"><strong>Decisão</strong><div>${decision.summary}</div></article>`;
}
