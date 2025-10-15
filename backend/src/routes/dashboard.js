const express = require('express');
const dashboardAuth = require('../middleware/dashboardAuth');
const configDashboardService = require('../services/configDashboardService');

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
        max-width: 640px;
      }

      .metadata {
        font-size: 0.85rem;
        color: #4a5568;
      }

      form {
        display: grid;
        gap: 1.5rem;
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
      input[type="password"] {
        flex: 1;
        padding: 0.75rem 0.85rem;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        font-size: 0.95rem;
        transition: border 120ms ease, box-shadow 120ms ease;
        background: #f8fafc;
      }

      input[type="text"]:focus,
      input[type="password"]:focus {
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
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Configuration Dashboard</h1>
          <p class="description">
            Beheer de applicatie secrets en omgeving variabelen voor de staging omgeving. Waarden worden veilig opgeslagen op de server en direct toegepast zonder herstart.
          </p>
        </div>
        <div class="metadata" id="metadata"></div>
      </header>
      <form id="env-form">
        <section class="field">
          <h2>Applicatie variabelen</h2>
          <p>Voer nieuwe waarden in om bij te werken. Laat het veld leeg om de huidige waarde te behouden of gebruik "Verwijderen" om een waarde te wissen.</p>
        </section>
        <div id="entries"></div>
        <button class="primary" type="submit">Wijzigingen opslaan</button>
      </form>
    </main>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <script>
      const form = document.getElementById('env-form');
      const entriesContainer = document.getElementById('entries');
      const metadataEl = document.getElementById('metadata');
      const toastEl = document.getElementById('toast');
      let managedKeys = [];

      function showToast(message) {
        toastEl.textContent = message;
        toastEl.dataset.visible = 'true';
        setTimeout(() => {
          toastEl.dataset.visible = 'false';
        }, 3200);
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

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'input-' + entry.name;
        input.name = entry.name;
        input.placeholder = entry.preview ? 'Huidig: ' + entry.preview : 'Nog niet ingesteld';
        input.autocomplete = 'off';
        input.dataset.dirty = 'false';
        input.dataset.cleared = 'false';
        input.addEventListener('input', () => {
          input.dataset.dirty = 'true';
          input.dataset.cleared = 'false';
        });

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
        row.appendChild(clearButton);
        wrapper.appendChild(row);

        return wrapper;
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
        entriesContainer.innerHTML = '';

        payload.entries.forEach((entry) => {
          entriesContainer.appendChild(createEntryRow(entry));
        });

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

module.exports = router;
