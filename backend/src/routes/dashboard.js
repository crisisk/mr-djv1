const express = require('express');
const dashboardAuth = require('../middleware/dashboardAuth');
const configDashboardService = require('../services/configDashboardService');
const rentGuyService = require('../services/rentGuyService');

const router = express.Router();

router.use(dashboardAuth);

function renderPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Configuration Dashboard</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f7f7f7;
        color: #1a1a1a;
      }

      body {
        margin: 0;
      }

      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 3rem;
      }

      header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 2.5rem;
      }

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      p.description {
        margin: 0.25rem 0 0;
        color: #4a5568;
        max-width: 720px;
      }

      .metadata {
        font-size: 0.85rem;
        color: #4a5568;
      }

      form {
        display: grid;
        gap: 1.5rem;
      }

      .tabs {
        display: inline-flex;
        gap: 0.6rem;
        margin-bottom: 0.5rem;
        padding: 0.35rem;
        border-radius: 999px;
        background: rgba(226, 232, 240, 0.6);
      }

      .tabs[data-hidden="true"] {
        display: none;
      }

      .tabs button {
        border: none;
        border-radius: 999px;
        padding: 0.45rem 1.25rem;
        font-size: 0.9rem;
        font-weight: 600;
        background: transparent;
        color: #475569;
        cursor: pointer;
        transition: background 120ms ease, color 120ms ease, box-shadow 120ms ease;
      }

      .tabs button[data-active="true"] {
        background: white;
        color: #1e293b;
        box-shadow: 0 8px 18px rgba(148, 163, 184, 0.35);
      }

      .group {
        display: grid;
        gap: 1.5rem;
      }

      .group[hidden] {
        display: none;
      }

      .group-header h2 {
        margin: 0 0 0.35rem;
        font-size: 1.15rem;
        letter-spacing: -0.01em;
      }

      .group-header p {
        margin: 0;
        color: #4a5568;
        font-size: 0.9rem;
      }

      .field {
        background: #ffffff;
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(226, 232, 240, 0.8);
      }

      .field h2 {
        margin: 0 0 0.5rem;
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }

      .field p {
        margin: 0;
        font-size: 0.9rem;
        color: #64748b;
      }

      .field .hint {
        margin-top: 0.75rem;
        font-size: 0.85rem;
        color: #475569;
        line-height: 1.4;
      }

      .field label {
        display: block;
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
        color: #334155;
        letter-spacing: 0.02em;
      }

      .input-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      input[type="text"],
      input[type="password"],
      input[type="number"] {
        flex: 1;
        padding: 0.75rem 0.85rem;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        font-size: 0.95rem;
        transition: border 120ms ease, box-shadow 120ms ease;
        background: #f8fafc;
      }

      input[type="text"]:focus,
      input[type="password"]:focus,
      input[type="number"]:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      input[readonly] {
        background: #e2e8f0;
        border-style: dashed;
        color: #475569;
      }

      button.primary {
        align-self: start;
        padding: 0.9rem 1.75rem;
        border-radius: 999px;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease;
      }

      button.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 25px rgba(99, 102, 241, 0.2);
      }

      button.secondary {
        padding: 0.55rem 0.9rem;
        border-radius: 8px;
        border: 1px solid #cbd5e1;
        background: white;
        color: #1e293b;
        cursor: pointer;
        font-weight: 500;
      }

      button.secondary.ghost {
        border-style: dashed;
        color: #475569;
        background: rgba(241, 245, 249, 0.65);
      }

      button.secondary.danger {
        border-color: rgba(248, 113, 113, 0.65);
        color: #b91c1c;
        background: rgba(254, 226, 226, 0.65);
      }

      button.secondary[data-state="cleared"] {
        border-color: #f87171;
        color: #b91c1c;
        background: #fee2e2;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.75rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        background: rgba(34, 197, 94, 0.12);
        color: #166534;
      }

      .status-pill[data-state="missing"] {
        background: rgba(248, 113, 113, 0.12);
        color: #b91c1c;
      }

      .empty-state {
        margin: 0;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: rgba(226, 232, 240, 0.35);
        color: #475569;
        font-size: 0.95rem;
      }

      .toast {
        position: fixed;
        inset-inline: 50%;
        bottom: 2rem;
        transform: translateX(-50%);
        padding: 0.85rem 1.5rem;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.95);
        color: white;
        font-size: 0.95rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
        opacity: 0;
        pointer-events: none;
        transition: opacity 180ms ease;
      }

      .toast[data-visible="true"] {
        opacity: 1;
      }

      .integration-card {
        background: linear-gradient(145deg, rgba(237, 242, 247, 0.9), rgba(255, 255, 255, 0.95));
        border: 1px solid rgba(148, 163, 184, 0.25);
      }

      .integration-card .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.75rem 1.5rem;
        margin: 1rem 0 0;
        padding: 0;
      }

      .integration-card .status-grid dt {
        margin: 0;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
      }

      .integration-card .status-grid dd {
        margin: 0.25rem 0 0;
        font-size: 0.95rem;
        color: #0f172a;
      }

      .integration-card .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.25rem;
      }

      .integration-card .actions button {
        flex: 1 0 200px;
      }

      .integration-card .hint.result {
        margin-top: 0.85rem;
        color: #1e293b;
      }

      @media (max-width: 720px) {
        header {
          flex-direction: column;
          align-items: flex-start;
        }

        button.primary {
          width: 100%;
        }

        .input-row {
          flex-direction: column;
          align-items: stretch;
        }

        button.secondary {
          width: 100%;
        }

        .integration-card .actions button {
          flex-basis: 100%;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Configuration Dashboard</h1>
          <p class="description">
            Beheer de applicatie secrets en omgeving variabelen voor de staging omgeving. Waarden worden veilig opgeslagen op de
            server en direct toegepast zonder herstart.
          </p>
          <p class="description">
            Gebruik de tab "E-mailintegratie" om de provider, API-key, afzender en template-ID's voor transactionele mails in te
            vullen zodat de app volledig functioneel is.
          </p>
        </div>
        <div class="metadata" id="metadata"></div>
      </header>
      <form id="env-form">
        <section class="field">
          <h2>Applicatie variabelen</h2>
          <p>Voer nieuwe waarden in om bij te werken. Laat het veld leeg om de huidige waarde te behouden of gebruik "Verwijderen"
 om een waarde te wissen.</p>
        </section>
        <div class="tabs" id="tabs" role="tablist" aria-label="Configuratie categorieën"></div>
        <div id="groups"></div>
        <button class="primary" type="submit">Wijzigingen opslaan</button>
      </form>
    </main>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <script>
      const form = document.getElementById('env-form');
      const tabsContainer = document.getElementById('tabs');
      const groupsContainer = document.getElementById('groups');
      const metadataEl = document.getElementById('metadata');
      const toastEl = document.getElementById('toast');
      let managedKeys = [];
      let currentGroupId = null;
      let rentGuyStatusControls = null;

      const FIELD_METADATA = {
        RENTGUY_API_BASE_URL: {
          placeholder: 'https://api.rentguy.app/v1',
          hint: 'Volledige basis-URL van de RentGuy API. Gebruik de productie- of staging endpoint en include geen trailing slash.',
          autocomplete: 'off'
        },
        RENTGUY_API_KEY: {
          type: 'password',
          secret: true,
          autocomplete: 'new-password',
          hint: 'Persoonlijke of service API-key uit RentGuy. Wordt versleuteld opgeslagen in \`managed.env\`.'
        },
        RENTGUY_WORKSPACE_ID: {
          placeholder: 'workspace-id (optioneel)',
          hint: 'Optioneel workspace- of tenant-ID wanneer meerdere omgevingen in RentGuy actief zijn.'
        },
        RENTGUY_TIMEOUT_MS: {
          type: 'number',
          inputMode: 'numeric',
          min: '1000',
          step: '500',
          hint: 'Timeout in milliseconden voor API-calls. Laat leeg voor de standaardwaarde van 5000ms.'
        }
      };

      function showToast(message) {
        toastEl.textContent = message;
        toastEl.dataset.visible = 'true';
        setTimeout(() => {
          toastEl.dataset.visible = 'false';
        }, 3200);
      }

      function setActiveGroup(groupId) {
        currentGroupId = groupId;
        const groupSections = groupsContainer.querySelectorAll('.group');
        groupSections.forEach((section) => {
          const isActive = section.dataset.groupId === groupId;
          section.hidden = !isActive;
          section.dataset.active = isActive ? 'true' : 'false';
        });

        const tabButtons = tabsContainer.querySelectorAll('button');
        tabButtons.forEach((button) => {
          button.dataset.active = button.dataset.groupId === groupId ? 'true' : 'false';
        });
      }

      function createEntryRow(entry) {
        const wrapper = document.createElement('section');
        wrapper.className = 'field';

        const label = document.createElement('label');
        label.textContent = entry.name;
        label.htmlFor = 'input-' + entry.name;
        wrapper.appendChild(label);

        const status = document.createElement('div');
        status.className = 'status-pill';
        status.dataset.state = entry.hasValue ? 'configured' : 'missing';
        status.textContent = entry.hasValue ? 'Geconfigureerd' : 'Ontbreekt';
        wrapper.appendChild(status);

        const row = document.createElement('div');
        row.className = 'input-row';

        const metadata = FIELD_METADATA[entry.name] || {};
        const baseType = metadata.type || 'text';

        const input = document.createElement('input');
        input.type = baseType;
        input.id = 'input-' + entry.name;
        input.name = entry.name;
        input.placeholder = entry.preview
          ? 'Huidig: ' + entry.preview
          : metadata.placeholder || 'Nog niet ingesteld';
        input.autocomplete = metadata.autocomplete || 'off';
        if (metadata.inputMode) {
          input.inputMode = metadata.inputMode;
        }
        if (metadata.min) {
          input.min = metadata.min;
        }
        if (metadata.step) {
          input.step = metadata.step;
        }
        if (metadata.maxLength) {
          input.maxLength = metadata.maxLength;
        }
        input.dataset.dirty = 'false';
        input.dataset.cleared = 'false';
        input.addEventListener('input', () => {
          input.dataset.dirty = 'true';
          input.dataset.cleared = 'false';
        });

        let toggleButton = null;
        if (metadata.secret) {
          toggleButton = document.createElement('button');
          toggleButton.type = 'button';
          toggleButton.className = 'secondary ghost';
          toggleButton.textContent = 'Toon';
          toggleButton.addEventListener('click', () => {
            if (input.type === 'password') {
              input.type = 'text';
              toggleButton.textContent = 'Verberg';
            } else {
              input.type = 'password';
              toggleButton.textContent = 'Toon';
            }
          });
        }

        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.className = 'secondary';
        clearButton.textContent = 'Verwijderen';
        clearButton.addEventListener('click', () => {
          if (input.dataset.cleared === 'true') {
            input.dataset.cleared = 'false';
            input.dataset.dirty = 'false';
            clearButton.dataset.state = 'default';
            clearButton.textContent = 'Verwijderen';
          } else {
            input.value = '';
            input.dataset.dirty = 'true';
            input.dataset.cleared = 'true';
            clearButton.dataset.state = 'cleared';
            clearButton.textContent = 'Verwijderen geactiveerd';
          }
        });

        row.appendChild(input);
        if (toggleButton) {
          row.appendChild(toggleButton);
        }
        row.appendChild(clearButton);
        wrapper.appendChild(row);

        if (metadata.hint) {
          const hint = document.createElement('p');
          hint.className = 'hint';
          hint.textContent = metadata.hint;
          wrapper.appendChild(hint);
        }

        return wrapper;
      }

      function formatDateTime(value) {
        if (!value) {
          return 'Nog niet uitgevoerd';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return 'Onbekende datum';
        }

        return date.toLocaleString();
      }

      function createRentGuyStatusCard() {
        const card = document.createElement('section');
        card.className = 'field integration-card';

        const heading = document.createElement('h2');
        heading.textContent = 'RentGuy integratiestatus';
        card.appendChild(heading);

        const description = document.createElement('p');
        description.className = 'hint';
        description.textContent =
          'Bekijk de actuele configuratie, queue en eventuele fouten. Flush de queue handmatig na het invullen van nieuwe API-waardes.';
        card.appendChild(description);

        const indicator = document.createElement('div');
        indicator.className = 'status-pill';
        indicator.dataset.state = 'missing';
        indicator.textContent = 'Niet geconfigureerd';
        card.appendChild(indicator);

        const statusGrid = document.createElement('dl');
        statusGrid.className = 'status-grid';

        function createRow(label) {
          const dt = document.createElement('dt');
          dt.textContent = label;
          const dd = document.createElement('dd');
          dd.textContent = '—';
          statusGrid.appendChild(dt);
          statusGrid.appendChild(dd);
          return dd;
        }

        const queueValue = createRow('Queue grootte');
        const workspaceValue = createRow('Workspace ID');
        const lastSuccessValue = createRow('Laatste succesvolle sync');
        const lastErrorValue = createRow('Laatste fout');
        const nextRetryValue = createRow('Volgende wachtrij item');

        card.appendChild(statusGrid);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.className = 'secondary';
        refreshButton.textContent = 'Status verversen';
        refreshButton.addEventListener('click', () => {
          refreshRentGuyStatus(true).catch((error) => {
            console.error(error);
          });
        });
        actions.appendChild(refreshButton);

        const flushButton = document.createElement('button');
        flushButton.type = 'button';
        flushButton.className = 'secondary danger';
        flushButton.textContent = 'Queue flushen';
        flushButton.disabled = true;
        flushButton.addEventListener('click', () => {
          flushRentGuyQueue().catch((error) => {
            console.error(error);
          });
        });
        actions.appendChild(flushButton);

        card.appendChild(actions);

        const resultMessage = document.createElement('p');
        resultMessage.className = 'hint result';
        card.appendChild(resultMessage);

        rentGuyStatusControls = {
          card,
          indicator,
          queueValue,
          workspaceValue,
          lastSuccessValue,
          lastErrorValue,
          nextRetryValue,
          refreshButton,
          flushButton,
          resultMessage
        };

        return card;
      }

      function renderRentGuyStatus(status) {
        if (!rentGuyStatusControls) {
          return;
        }

        const configured = Boolean(status && status.configured);
        rentGuyStatusControls.indicator.dataset.state = configured ? 'configured' : 'missing';
        rentGuyStatusControls.indicator.textContent = configured ? 'API geconfigureerd' : 'Niet geconfigureerd';

        const queueSize = status && Number.isFinite(status.queueSize) ? status.queueSize : 0;
        rentGuyStatusControls.queueValue.textContent = String(queueSize);
        rentGuyStatusControls.workspaceValue.textContent = status && status.workspaceId ? status.workspaceId : 'Niet ingesteld';

        if (status && status.lastSyncSuccess) {
          const success = status.lastSyncSuccess;
          const resource = success.resource || 'onbekend';
          const attempts = Number.isFinite(success.attempts) ? success.attempts : 0;
          rentGuyStatusControls.lastSuccessValue.textContent =
            formatDateTime(success.at) + ' • ' + resource + ' (' + attempts + ' poging(en))';
        } else {
          rentGuyStatusControls.lastSuccessValue.textContent = 'Nog geen succesvolle sync';
        }

        if (status && status.lastSyncError) {
          const errorInfo = status.lastSyncError;
          const message = errorInfo.message || 'Onbekende fout';
          rentGuyStatusControls.lastErrorValue.textContent =
            formatDateTime(errorInfo.at) + ' • ' + message;
        } else {
          rentGuyStatusControls.lastErrorValue.textContent = 'Geen fouten geregistreerd';
        }

        if (status && status.nextInQueue) {
          const next = status.nextInQueue;
          const resource = next.resource || 'onbekend';
          const attempts = Number.isFinite(next.attempts) ? next.attempts : 0;
          rentGuyStatusControls.nextRetryValue.textContent =
            formatDateTime(next.enqueuedAt) + ' • ' + resource + ' (' + attempts + ' poging(en))';
        } else {
          rentGuyStatusControls.nextRetryValue.textContent = 'Geen wachtrij';
        }

        rentGuyStatusControls.flushButton.disabled = !configured || queueSize === 0;
      }

      async function refreshRentGuyStatus(showToastOnSuccess = false) {
        if (!rentGuyStatusControls) {
          return;
        }

        rentGuyStatusControls.card.dataset.loading = 'true';
        rentGuyStatusControls.resultMessage.textContent = '';

        try {
          const response = await fetch('./api/integrations/rentguy/status', {
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Kon RentGuy status niet ophalen');
          }

          const payload = await response.json();
          renderRentGuyStatus(payload);

          if (showToastOnSuccess) {
            showToast('RentGuy status bijgewerkt');
          }
        } catch (error) {
          console.error(error);
          showToast(error.message || 'RentGuy status niet beschikbaar');
        } finally {
          delete rentGuyStatusControls.card.dataset.loading;
        }
      }

      async function flushRentGuyQueue() {
        if (!rentGuyStatusControls) {
          return;
        }

        rentGuyStatusControls.flushButton.disabled = true;
        rentGuyStatusControls.resultMessage.textContent = '';

        try {
          const response = await fetch('./api/integrations/rentguy/flush', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });

          if (!response.ok) {
            throw new Error('Flush mislukt');
          }

          const payload = await response.json();
          if (!payload.configured) {
            rentGuyStatusControls.resultMessage.textContent =
              'Integratie nog niet geconfigureerd – vul de RentGuy API-gegevens in om de queue te flushen.';
            showToast('RentGuy flush overgeslagen: configureer RentGuy API');
            await refreshRentGuyStatus();
            return;
          }

          rentGuyStatusControls.resultMessage.textContent =
            'Flush uitgevoerd: ' +
            payload.delivered +
            '/' +
            payload.attempted +
            ' verstuurd, ' +
            payload.remaining +
            ' resterend.';
          showToast('RentGuy queue flush uitgevoerd');
          await refreshRentGuyStatus();
        } catch (error) {
          console.error(error);
          rentGuyStatusControls.resultMessage.textContent = error.message || 'Flush mislukt';
          showToast(error.message || 'Flush mislukt');
          try {
            await refreshRentGuyStatus();
          } catch (refreshError) {
            console.error(refreshError);
          }
        }
      }

      function createGroupSection(group) {
        const section = document.createElement('section');
        section.className = 'group';
        section.dataset.groupId = group.id;
        section.hidden = true;

        const header = document.createElement('div');
        header.className = 'group-header';

        const title = document.createElement('h2');
        title.textContent = group.label || group.id;
        header.appendChild(title);

        if (group.description) {
          const paragraph = document.createElement('p');
          paragraph.textContent = group.description;
          header.appendChild(paragraph);
        }

        section.appendChild(header);

        if (group.id === 'rentguy') {
          section.appendChild(createRentGuyStatusCard());
        }

        const entries = Array.isArray(group.entries) ? group.entries : [];
        entries.forEach((entry) => {
          section.appendChild(createEntryRow(entry));
        });

        return section;
      }

      function renderGroups(groups) {
        tabsContainer.innerHTML = '';
        groupsContainer.innerHTML = '';
        rentGuyStatusControls = null;

        if (!groups.length) {
          tabsContainer.dataset.hidden = 'true';
          const empty = document.createElement('p');
          empty.className = 'empty-state';
          empty.textContent = 'Er zijn momenteel geen beheerde variabelen geconfigureerd.';
          groupsContainer.appendChild(empty);
          return;
        }

        if (groups.length <= 1) {
          tabsContainer.dataset.hidden = 'true';
        } else {
          delete tabsContainer.dataset.hidden;
        }

        let initialGroupId = null;

        groups.forEach((group, index) => {
          const section = createGroupSection(group);
          groupsContainer.appendChild(section);

          if (groups.length > 1) {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.groupId = group.id;
            button.textContent = group.label || group.id;
            button.addEventListener('click', () => setActiveGroup(group.id));
            tabsContainer.appendChild(button);
          }

          if (index === 0) {
            initialGroupId = group.id;
          }
        });

        if (initialGroupId) {
          setActiveGroup(initialGroupId);
        }

        if (rentGuyStatusControls) {
          refreshRentGuyStatus().catch((error) => {
            console.error(error);
          });
        }
      }

      async function loadState() {
        const response = await fetch('./api/variables', {
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Kon configuratie niet ophalen');
        }

        const payload = await response.json();
        managedKeys = Array.isArray(payload.managedKeys) ? payload.managedKeys : [];
        renderGroups(Array.isArray(payload.groups) ? payload.groups : []);

        const metadataItems = [];
        if (payload.metadata?.lastModified) {
          metadataItems.push('Laatst bijgewerkt: ' + new Date(payload.metadata.lastModified).toLocaleString());
        }
        if (payload.metadata?.storePath) {
          metadataItems.push('Opslagbestand: ' + payload.metadata.storePath);
        }
        metadataEl.textContent = metadataItems.join(' • ');
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = {};

        managedKeys.forEach((name) => {
          const input = document.getElementById('input-' + name);
          if (!input) {
            return;
          }

          if (input.dataset.cleared === 'true') {
            payload[name] = '';
          } else if (input.dataset.dirty === 'true') {
            payload[name] = input.value;
          } else {
            payload[name] = null;
          }
        });

        try {
          const response = await fetch('./api/variables', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entries: payload })
          });

          if (!response.ok) {
            throw new Error('Opslaan mislukt');
          }

          await loadState();
          showToast('Configuratie opgeslagen');
        } catch (error) {
          console.error(error);
          showToast(error.message || 'Er ging iets mis');
        }
      });

      loadState().catch((error) => {
        console.error(error);
        showToast('Kon dashboard gegevens niet laden');
      });
    </script>
  </body>
</html>`;
}

router.get('/', (_req, res) => {
  res.type('html').send(renderPage());
});

router.get('/api/variables', async (_req, res, next) => {
  try {
    const state = await configDashboardService.getState();
    res.json(state);
  } catch (error) {
    next(error);
  }
});

router.post('/api/variables', async (req, res, next) => {
  try {
    const entries = req.body?.entries;

    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    const state = await configDashboardService.updateValues(entries);
    res.json(state);
  } catch (error) {
    next(error);
  }
});

router.get('/api/integrations/rentguy/status', (_req, res) => {
  res.json(rentGuyService.getStatus());
});

router.post('/api/integrations/rentguy/flush', async (req, res, next) => {
  try {
    const rawLimit = req.body?.limit;
    const parsedLimit = Number(rawLimit);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;
    const result = await rentGuyService.flushQueue(limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
