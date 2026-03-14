const now = new Date();

const store = {
  meetings: [
    {
      id: 'meeting-1',
      title: 'Comitê de Operações Hospitalares',
      status: 'draft',
      createdAt: now.toISOString(),
      agendas: [
        {
          id: 'agenda-1',
          title: 'Superlotação na emergência',
          problems: [],
          decision: null,
          actions: [],
        },
        {
          id: 'agenda-2',
          title: 'Atraso no laboratório',
          problems: [],
          decision: null,
          actions: [],
        },
      ],
      timeline: [],
    },
  ],
};

module.exports = store;
