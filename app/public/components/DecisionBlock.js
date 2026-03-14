import { ProblemaCard } from './ProblemaCard.js';
import { DecisaoCard } from './DecisaoCard.js';
import { AcaoCard } from './AcaoCard.js';

export function DecisionBlock(agenda) {
  const problems = agenda.problems.map(ProblemaCard).join('') || '<small>Sem problemas registrados.</small>';
  const actions = agenda.actions.map(AcaoCard).join('') || '<small>Sem ações registradas.</small>';

  return `
    <section class="stack">
      <header><h3>${agenda.title}</h3></header>
      <div>
        <h4>PautaHeader / ProblemasSection</h4>
        ${problems}
      </div>
      <div>
        <h4>DecisaoSection</h4>
        ${DecisaoCard(agenda.decision)}
      </div>
      <div>
        <h4>AcoesSection</h4>
        ${actions}
      </div>
    </section>
  `;
}
