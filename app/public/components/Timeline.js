export function renderTimeline(container, timeline) {
  container.innerHTML = timeline
    .map((event) => {
      const time = new Date(event.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `<div class="timeline-item"><strong>${time}</strong><span>${event.description}</span></div>`;
    })
    .join('') || '<small>Nenhum evento registrado ainda.</small>';
}
