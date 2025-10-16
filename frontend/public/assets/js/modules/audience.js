import { prepareRevealElement } from './reveal.js';

export const initAudienceMatcher = (analytics) => {
  const tabs = Array.from(document.querySelectorAll('.audience-tab'));
  const panels = Array.from(document.querySelectorAll('.audience-panel'));
  if (!tabs.length || !panels.length) return;

  const eventTypeField = document.getElementById('eventType');
  const messageField = document.getElementById('message');
  const eventTypeToPersona = {
    bruiloft: 'bruiloft',
    bedrijfsfeest: 'bedrijfsfeest',
    verjaardag: 'private',
    jubileum: 'private',
  };

  let activePersona = null;
  let messageEditedManually = false;

  if (messageField) {
    messageField.addEventListener('input', () => {
      if (messageField.dataset.autofilled === 'true') {
        messageField.dataset.autofilled = 'false';
      }
      messageEditedManually = messageField.value.trim().length > 0;
    });
  }

  const highlightPanel = (panel) => {
    document
      .querySelectorAll('.audience-panel, .audience-tab')
      .forEach((element) => prepareRevealElement(element));
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const activatePersona = (persona, { force = false } = {}) => {
    if (!persona) return;
    if (activePersona === persona && !force) return;
    activePersona = persona;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.persona === persona;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.persona === persona;
      panel.classList.toggle('active', isActive);
      if (isActive) {
        panel.focus({ preventScroll: true });
        highlightPanel(panel);
      }
    });

    const activePanel = panels.find((panel) => panel.dataset.persona === persona);
    if (!activePanel) return;

    const personaDetail = {
      persona,
      event_type: activePanel.dataset.eventType || null,
      recommended_package: activePanel.dataset.package || null,
      keywords: activePanel.dataset.keywords || null,
    };

    if (eventTypeField && activePanel.dataset.eventType) {
      eventTypeField.value = activePanel.dataset.eventType;
    }

    if (messageField) {
      const suggestedMessage = activePanel.dataset.message;
      if (suggestedMessage && (!messageEditedManually || !messageField.value.trim())) {
        messageField.value = suggestedMessage;
        messageField.dataset.autofilled = 'true';
        messageEditedManually = false;
      }
      const keywords = activePanel.dataset.keywords;
      if (keywords) {
        messageField.placeholder = `Vertel ons meer (${keywords.toLowerCase()})`;
      }
    }

    document.dispatchEvent(
      new CustomEvent('persona:change', {
        detail: personaDetail,
      })
    );

    if (analytics) {
      analytics.trackPersonaFocus(personaDetail);
    }
  };

  tabs.forEach((tab) => {
    const persona = tab.dataset.persona;
    tab.addEventListener('click', () => activatePersona(persona));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activatePersona(persona);
      }
    });
  });

  if (eventTypeField) {
    eventTypeField.addEventListener('change', (event) => {
      const persona = eventTypeToPersona[event.target.value];
      if (persona) {
        activatePersona(persona);
      }
    });
  }

  document.addEventListener('contact:formReset', () => {
    messageEditedManually = false;
    if (messageField) {
      messageField.dataset.autofilled = 'false';
    }
    if (activePersona) {
      activatePersona(activePersona, { force: true });
    }
  });

  activatePersona(tabs[0]?.dataset.persona || 'bruiloft', { force: true });
};
