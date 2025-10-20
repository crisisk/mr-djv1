const express = require('express');
const dashboardAuth = require('../middleware/dashboardAuth');
const configDashboardService = require('../services/configDashboardService');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');
const observabilityService = require('../services/observabilityService');
const { logger } = require('../lib/logger');

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

      .roles-panel {
        background: #ffffff;
        border-radius: 16px;
        padding: 1.75rem 1.5rem;
        margin-bottom: 1.75rem;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(226, 232, 240, 0.85);
      }

      .roles-panel[data-dirty="true"] {
        border-color: rgba(99, 102, 241, 0.55);
        box-shadow: 0 18px 40px rgba(99, 102, 241, 0.18);
      }

      .roles-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }

      .roles-header h2 {
        margin: 0;
        font-size: 1.25rem;
        letter-spacing: -0.01em;
      }

      .roles-header p {
        margin: 0.35rem 0 0;
        color: #475569;
        font-size: 0.95rem;
        max-width: 520px;
      }

      .roles-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.85rem;
      }

      .role-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        border: 1px solid rgba(226, 232, 240, 0.8);
        background: #f8fafc;
      }

      .role-item.role-item--empty {
        justify-content: center;
        color: #64748b;
        font-style: italic;
      }

      .role-meta {
        flex: 1;
        display: grid;
        gap: 0.35rem;
      }

      .role-meta h3 {
        margin: 0;
        font-size: 1rem;
        letter-spacing: -0.01em;
      }

      .role-meta p {
        margin: 0;
        font-size: 0.9rem;
        color: #475569;
      }

      .role-count {
        font-size: 0.85rem;
        color: #6366f1;
        font-weight: 600;
      }

      .role-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .role-actions button {
        width: 140px;
      }

      .role-assignment {
        margin-top: 1.25rem;
        border-top: 1px solid rgba(226, 232, 240, 0.85);
        padding-top: 1rem;
      }

      .role-assignment__label {
        margin: 0 0 0.5rem;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
      }

      .role-assignment__options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .role-assignment__empty {
        margin: 0.35rem 0 0;
        font-size: 0.85rem;
        color: #64748b;
      }

      .role-assignment__summary {
        margin: 0.35rem 0 0;
        font-size: 0.85rem;
        color: #334155;
      }

      .role-assignment__summary[data-empty="true"] {
        color: #64748b;
        font-style: italic;
      }

      .role-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        border: 1px solid #cbd5e1;
        background: white;
        font-size: 0.85rem;
        color: #1e293b;
        cursor: pointer;
        transition: border 120ms ease, box-shadow 120ms ease;
      }

      .role-chip:hover {
        border-color: #6366f1;
        box-shadow: 0 6px 12px rgba(99, 102, 241, 0.12);
      }

      .role-chip input {
        accent-color: #6366f1;
      }

      .role-chip span {
        line-height: 1;
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

      .status-pill[data-state="attention"] {
        background: rgba(251, 191, 36, 0.18);
        color: #92400e;
      }

      .empty-state {
        margin: 0;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: rgba(226, 232, 240, 0.35);
        color: #475569;
        font-size: 0.95rem;
      }

      .metric-list {
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;
        display: grid;
        gap: 0.5rem;
      }

      .metric-list li {
        background: rgba(226, 232, 240, 0.35);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        color: #1e293b;
      }

      .variant-table {
        margin-top: 1rem;
        display: grid;
        gap: 0.75rem;
      }

      .variant-table article {
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        padding: 1rem 1.25rem;
        background: rgba(248, 250, 252, 0.65);
      }

      .variant-table article h3 {
        margin: 0 0 0.35rem;
        font-size: 1rem;
      }

      .variant-table article dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.5rem;
      }

      .variant-table article dl dt {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.08em;
      }

      .variant-table article dl dd {
        margin: 0;
        font-weight: 600;
        color: #0f172a;
      }

      .variant-table article .keywords {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: #475569;
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

        .roles-header {
          flex-direction: column;
          align-items: stretch;
        }

        .role-item {
          flex-direction: column;
          align-items: stretch;
        }

        .role-actions {
          flex-direction: row;
          width: 100%;
        }

        .role-actions button {
          flex: 1 1 auto;
          width: auto;
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
      <section class="roles-panel" id="roles-panel">
        <div class="roles-header">
          <div>
            <h2>Rollen &amp; toegang</h2>
            <p>Beheer welke teams of personen toegang hebben tot de configuratievariabelen in deze omgeving.</p>
          </div>
          <button type="button" class="secondary" id="add-role">Nieuwe rol</button>
        </div>
        <ul class="roles-list" id="role-list"></ul>
      </section>
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
      const rolesPanel = document.getElementById('roles-panel');
      const roleList = document.getElementById('role-list');
      const addRoleButton = document.getElementById('add-role');
      let managedKeys = [];
      let currentGroupId = null;
      let roles = [];
      let roleAssignments = {};
      let rentGuyStatusControls = null;
      let sevensaStatusControls = null;
      let performanceStatusControls = null;
      let variantAnalyticsControls = null;

      function reportError(context, error) {
        try {
          const payload = {
            context,
            message: error && error.message ? error.message : String(error)
          };

          if (error && typeof error === 'object') {
            if (error.name) {
              payload.name = error.name;
            }
            if (error.stack) {
              payload.stack = error.stack;
            }
            if (error.details) {
              payload.details = error.details;
            }
          }

          fetch('./log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            keepalive: true,
            body: JSON.stringify(payload)
          }).catch(() => {});
        } catch (_loggingError) {
          // ignore logging failures
        }
      }

      function withErrorLogging(context, callback) {
        return (error) => {
          reportError(context, error);
          if (typeof callback === 'function') {
            callback(error);
          }
        };
      }

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
        },
        SEVENSA_SUBMIT_URL: {
          placeholder: 'https://api.hsforms.com/submissions/v3/...',
          hint: 'Volledige Sevensa submit URL vanuit het rentguy Config Dashboard (portal & form ID inbegrepen).',
          autocomplete: 'off'
        },
        SEVENSA_QUEUE_RETRY_DELAY_MS: {
          type: 'number',
          inputMode: 'numeric',
          min: '1000',
          step: '1000',
          hint: 'Basis retry-interval in milliseconden voor Sevensa queue verwerking (standaard 15000ms).'
        },
        SEVENSA_QUEUE_MAX_ATTEMPTS: {
          type: 'number',
          inputMode: 'numeric',
          min: '1',
          step: '1',
          hint: 'Maximale aantal verstuurpogingen voordat een lead in de dead letter queue terechtkomt (standaard 5).'
        }
      };

      function normalizeRoles(rawRoles) {
        if (!Array.isArray(rawRoles)) {
          return [];
        }

        return rawRoles
          .map((role) => {
            if (!role || typeof role !== 'object') {
              return null;
            }

            const id = typeof role.id === 'string' ? role.id : '';
            const name = typeof role.name === 'string' ? role.name : '';

            if (!id || !name) {
              return null;
            }

            return {
              id,
              name,
              description: typeof role.description === 'string' ? role.description : '',
              permissions: Array.isArray(role.permissions) ? role.permissions : []
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }));
      }

      function normalizeAssignmentsMap(raw) {
        const normalized = {};

        if (!raw || typeof raw !== 'object') {
          return normalized;
        }

        Object.entries(raw).forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            return;
          }

          const entries = value
            .map((roleId) => (typeof roleId === 'string' ? roleId.trim() : ''))
            .filter(Boolean);

          if (!entries.length) {
            return;
          }

          normalized[key] = Array.from(new Set(entries));
        });

        return normalized;
      }

      function getAssignmentsForKey(key) {
        const values = roleAssignments[key];
        if (!Array.isArray(values)) {
          return [];
        }
        return values.slice();
      }

      function serializeAssignments() {
        const result = {};
        const validIds = new Set(roles.map((role) => role.id));

        Object.entries(roleAssignments).forEach(([key, values]) => {
          if (!Array.isArray(values)) {
            return;
          }

          const filtered = values.filter((roleId) => validIds.has(roleId));

          if (!filtered.length) {
            return;
          }

          const unique = Array.from(new Set(filtered)).sort();
          result[key] = unique;
        });

        return result;
      }

      function countAssignmentsForRole(roleId) {
        let total = 0;

        Object.values(roleAssignments).forEach((values) => {
          if (Array.isArray(values) && values.includes(roleId)) {
            total += 1;
          }
        });

        return total;
      }

      function toggleRoleAssignment(key, roleId, enabled) {
        const current = new Set(getAssignmentsForKey(key));

        if (enabled) {
          current.add(roleId);
        } else {
          current.delete(roleId);
        }

        if (current.size) {
          roleAssignments[key] = Array.from(current).sort();
        } else {
          delete roleAssignments[key];
        }

        form.dataset.rolesDirty = 'true';
        renderRolesPanel();
        if (rolesPanel) {
          rolesPanel.dataset.dirty = 'true';
        }
      }

      function createRoleAssignmentControls(entry) {
        const wrapper = document.createElement('div');
        wrapper.className = 'role-assignment';

        const label = document.createElement('p');
        label.className = 'role-assignment__label';
        label.textContent = 'Toegestane rollen';
        wrapper.appendChild(label);

        if (!roles.length) {
          const empty = document.createElement('p');
          empty.className = 'role-assignment__empty';
          empty.textContent = 'Voeg rollen toe om toegang te beperken.';
          wrapper.appendChild(empty);
          return wrapper;
        }

        const options = document.createElement('div');
        options.className = 'role-assignment__options';
        const summary = document.createElement('p');
        summary.className = 'role-assignment__summary';

        const refreshSummary = () => {
          const assigned = getAssignmentsForKey(entry.name);
          if (assigned.length) {
            const names = roles
              .filter((role) => assigned.includes(role.id))
              .map((role) => role.name);
            summary.textContent = 'Toegewezen aan: ' + names.join(', ');
            summary.dataset.empty = 'false';
          } else {
            summary.textContent =
              'Geen rollen toegewezen - iedereen met dashboard toegang kan deze variabele beheren.';
            summary.dataset.empty = 'true';
          }
        };

        const assigned = new Set(getAssignmentsForKey(entry.name));

        roles.forEach((role) => {
          const option = document.createElement('label');
          option.className = 'role-chip';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = role.id;
          checkbox.checked = assigned.has(role.id);
          checkbox.addEventListener('change', (event) => {
            toggleRoleAssignment(entry.name, role.id, event.target.checked);
            refreshSummary();
          });

          const chipLabel = document.createElement('span');
          chipLabel.textContent = role.name;

          option.appendChild(checkbox);
          option.appendChild(chipLabel);
          options.appendChild(option);
        });

        wrapper.appendChild(options);
        refreshSummary();
        wrapper.appendChild(summary);

        return wrapper;
      }

      async function handleCreateRole() {
        const nameInput = window.prompt('Naam van de nieuwe rol:');

        if (nameInput === null) {
          return;
        }

        const trimmedName = nameInput.trim();

        if (!trimmedName) {
          showToast('Rolnaam mag niet leeg zijn');
          return;
        }

        const descriptionInput = window.prompt('Omschrijving (optioneel):', '');
        const description = descriptionInput === null ? '' : descriptionInput.trim();

        try {
          const response = await fetch('./api/roles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: trimmedName, description })
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || 'Kon rol niet opslaan');
          }

          showToast('Rol aangemaakt');
          await loadState();
        } catch (error) {
          console.error(error);
          showToast(error.message || 'Kon rol niet opslaan');
        }
      }

      async function handleEditRole(role) {
        const nameInput = window.prompt('Bewerk rolnaam', role.name);

        if (nameInput === null) {
          return;
        }

        const trimmedName = nameInput.trim();

        if (!trimmedName) {
          showToast('Rolnaam mag niet leeg zijn');
          return;
        }

        const descriptionInput = window.prompt('Bewerk omschrijving', role.description || '');
        const description = descriptionInput === null ? '' : descriptionInput.trim();

        try {
          const response = await fetch('./api/roles/' + encodeURIComponent(role.id), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: trimmedName, description })
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || 'Kon rol niet bijwerken');
          }

          showToast('Rol bijgewerkt');
          await loadState();
        } catch (error) {
          console.error(error);
          showToast(error.message || 'Kon rol niet bijwerken');
        }
      }

      async function handleDeleteRole(role) {
        const confirmed = window.confirm(
          'Weet je zeker dat je de rol "' + role.name + '" wilt verwijderen?'
        );

        if (!confirmed) {
          return;
        }

        try {
          const response = await fetch('./api/roles/' + encodeURIComponent(role.id), {
            method: 'DELETE'
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || 'Kon rol niet verwijderen');
          }

          showToast('Rol verwijderd');
          await loadState();
        } catch (error) {
          console.error(error);
          showToast(error.message || 'Kon rol niet verwijderen');
        }
      }

      function renderRolesPanel() {
        if (!roleList) {
          return;
        }

        roleList.innerHTML = '';

        if (!roles.length) {
          const empty = document.createElement('li');
          empty.className = 'role-item role-item--empty';
          empty.textContent = 'Nog geen rollen aangemaakt.';
          roleList.appendChild(empty);
          return;
        }

        roles.forEach((role) => {
          const item = document.createElement('li');
          item.className = 'role-item';

          const meta = document.createElement('div');
          meta.className = 'role-meta';

          const title = document.createElement('h3');
          title.textContent = role.name;
          meta.appendChild(title);

          if (role.description) {
            const description = document.createElement('p');
            description.textContent = role.description;
            meta.appendChild(description);
          }

          const count = document.createElement('p');
          count.className = 'role-count';
          const usage = countAssignmentsForRole(role.id);
          count.textContent = usage === 1 ? '1 variabele' : usage + ' variabelen';
          meta.appendChild(count);

          item.appendChild(meta);

          const actions = document.createElement('div');
          actions.className = 'role-actions';

          const editButton = document.createElement('button');
          editButton.type = 'button';
          editButton.className = 'secondary';
          editButton.textContent = 'Bewerken';
          editButton.addEventListener('click', () => {
            handleEditRole(role).catch((error) => {
              console.error(error);
            });
          });
          actions.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.className = 'secondary danger';
          deleteButton.textContent = 'Verwijderen';
          deleteButton.addEventListener('click', () => {
            handleDeleteRole(role).catch((error) => {
              console.error(error);
            });
          });
          actions.appendChild(deleteButton);

          item.appendChild(actions);

          roleList.appendChild(item);
        });
      }

      if (addRoleButton) {
        addRoleButton.addEventListener('click', () => {
          handleCreateRole().catch((error) => {
            console.error(error);
          });
        });
      }

      renderRolesPanel();

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

        const roleControls = createRoleAssignmentControls(entry);
        if (roleControls) {
          wrapper.appendChild(roleControls);
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
          refreshRentGuyStatus(true).catch(
            withErrorLogging('rentguy:status:manual-refresh')
          );
        });
        actions.appendChild(refreshButton);

        const flushButton = document.createElement('button');
        flushButton.type = 'button';
        flushButton.className = 'secondary danger';
        flushButton.textContent = 'Queue flushen';
        flushButton.disabled = true;
        flushButton.addEventListener('click', () => {
          flushRentGuyQueue().catch(withErrorLogging('rentguy:queue:flush-click'));
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

      function createSevensaStatusCard() {
        const card = document.createElement('section');
        card.className = 'field integration-card';

        const heading = document.createElement('h2');
        heading.textContent = 'Sevensa submit & queue status';
        card.appendChild(heading);

        const description = document.createElement('p');
        description.className = 'hint';
        description.textContent =
          'Monitor de Sevensa submit URL, retry-queue en dead letters. Gebruik flush voor handmatige retries of verifieer de submit URL via rentguy instructies.';
        card.appendChild(description);

        const indicator = document.createElement('div');
        indicator.className = 'status-pill';
        indicator.dataset.state = 'missing';
        indicator.textContent = 'Submit URL ontbreekt';
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
        const deadLetterValue = createRow('Dead letters');
        const nextAttemptValue = createRow('Volgende retry');
        const lastErrorValue = createRow('Laatste fout');

        card.appendChild(statusGrid);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.className = 'secondary';
        refreshButton.textContent = 'Status verversen';
        refreshButton.addEventListener('click', () => {
          refreshSevensaStatus(true).catch(
            withErrorLogging('sevensa:status:manual-refresh')
          );
        });
        actions.appendChild(refreshButton);

        const flushButton = document.createElement('button');
        flushButton.type = 'button';
        flushButton.className = 'secondary danger';
        flushButton.textContent = 'Queue flushen';
        flushButton.disabled = true;
        flushButton.addEventListener('click', () => {
          flushSevensaQueue().catch(withErrorLogging('sevensa:queue:flush-click'));
        });
        actions.appendChild(flushButton);

        card.appendChild(actions);

        const resultMessage = document.createElement('p');
        resultMessage.className = 'hint result';
        card.appendChild(resultMessage);

        sevensaStatusControls = {
          card,
          indicator,
          queueValue,
          deadLetterValue,
          nextAttemptValue,
          lastErrorValue,
          refreshButton,
          flushButton,
          resultMessage
        };

        return card;
      }

      function createPerformanceStatusCard() {
        const card = document.createElement('section');
        card.className = 'field integration-card';

        const heading = document.createElement('h2');
        heading.textContent = 'Lighthouse & Axe monitoring';
        card.appendChild(heading);

        const description = document.createElement('p');
        description.className = 'hint';
        description.textContent =
          'Automatiseer Lighthouse/Axe audits per pagina en device. Bekijk queue, gemiddelde scores en auditgeschiedenis.';
        card.appendChild(description);

        const indicator = document.createElement('div');
        indicator.className = 'status-pill';
        indicator.dataset.state = 'missing';
        indicator.textContent = 'Nog geen audits';
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

        const performanceValue = createRow('Gem. performance');
        const accessibilityValue = createRow('Gem. accessibility');
        const bestPracticesValue = createRow('Gem. best practices');
        const seoValue = createRow('Gem. SEO');

        card.appendChild(statusGrid);

        const queueHeading = document.createElement('p');
        queueHeading.className = 'hint';
        queueHeading.textContent = 'In behandeling';
        card.appendChild(queueHeading);

        const queueList = document.createElement('ul');
        queueList.className = 'metric-list';
        card.appendChild(queueList);

        const historyHeading = document.createElement('p');
        historyHeading.className = 'hint';
        historyHeading.textContent = 'Laatste runs';
        card.appendChild(historyHeading);

        const historyList = document.createElement('ul');
        historyList.className = 'metric-list';
        card.appendChild(historyList);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const targetSelect = document.createElement('select');
        targetSelect.className = 'secondary';
        targetSelect.style.flex = '1 0 220px';
        actions.appendChild(targetSelect);

        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.className = 'secondary';
        refreshButton.textContent = 'Monitoring verversen';
        refreshButton.addEventListener('click', () => {
          refreshPerformanceStatus(true).catch(
            withErrorLogging('performance:status:manual-refresh')
          );
        });
        actions.appendChild(refreshButton);

        const runButton = document.createElement('button');
        runButton.type = 'button';
        runButton.className = 'secondary';
        runButton.textContent = 'Audit starten';
        runButton.addEventListener('click', () => {
          triggerPerformanceRun().catch(
            withErrorLogging('performance:run:trigger')
          );
        });
        actions.appendChild(runButton);

        card.appendChild(actions);

        performanceStatusControls = {
          card,
          indicator,
          performanceValue,
          accessibilityValue,
          bestPracticesValue,
          seoValue,
          queueList,
          historyList,
          targetSelect,
          refreshButton,
          runButton,
          targets: []
        };

        return card;
      }

      function renderPerformanceStatus(state) {
        if (!performanceStatusControls) {
          return;
        }

        const summary = state?.summary || {};
        const averages = summary.averageScores || null;
        const runs = Array.isArray(state?.runs) ? state.runs : [];
        const queue = Array.isArray(state?.queue) ? state.queue : [];
        const targets = Array.isArray(state?.targets) ? state.targets : [];

        performanceStatusControls.targets = targets;

        const select = performanceStatusControls.targetSelect;
        const previousValue = select.value;
        select.innerHTML = '';

        if (targets.length) {
          targets.forEach((target, index) => {
            const option = document.createElement('option');
            const fallbackId =
              (target.url || '/') + '-' + (target.device || 'desktop') + '-' + index;
            option.value = target.id || fallbackId;
            const deviceLabel = target.device ? target.device : 'desktop';
            const label = target.label || target.url;
            option.textContent = label + ' (' + deviceLabel + ')';
            select.appendChild(option);
          });

          if (targets.some((target) => target.id === previousValue)) {
            select.value = previousValue;
          }
        } else {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'Geen targets geconfigureerd';
          select.appendChild(option);
        }

        performanceStatusControls.runButton.disabled = targets.length === 0;

        if (!runs.length) {
          performanceStatusControls.indicator.dataset.state = 'missing';
          performanceStatusControls.indicator.textContent = 'Nog geen audits';
        } else if (summary.degradedRuns > 0) {
          performanceStatusControls.indicator.dataset.state = 'attention';
          performanceStatusControls.indicator.textContent =
            summary.degradedRuns + ' audit(s) vereisen aandacht';
        } else {
          performanceStatusControls.indicator.dataset.state = 'configured';
          performanceStatusControls.indicator.textContent = 'Audits gezond';
        }

        const setValue = (element, value, suffix = '%') => {
          if (typeof value === 'number' && Number.isFinite(value)) {
            element.textContent = String(value) + suffix;
          } else {
            element.textContent = '—';
          }
        };

        if (averages) {
          setValue(performanceStatusControls.performanceValue, averages.performance);
          setValue(performanceStatusControls.accessibilityValue, averages.accessibility);
          setValue(performanceStatusControls.bestPracticesValue, averages.bestPractices);
          setValue(performanceStatusControls.seoValue, averages.seo);
        } else {
          setValue(performanceStatusControls.performanceValue, null);
          setValue(performanceStatusControls.accessibilityValue, null);
          setValue(performanceStatusControls.bestPracticesValue, null);
          setValue(performanceStatusControls.seoValue, null);
        }

        performanceStatusControls.queueList.innerHTML = '';
        if (!queue.length) {
          const li = document.createElement('li');
          li.textContent = 'Geen geplande audits in de wachtrij.';
          performanceStatusControls.queueList.appendChild(li);
        } else {
          queue.forEach((item) => {
            const li = document.createElement('li');
            const when = item.requestedAt ? new Date(item.requestedAt).toLocaleString() : 'onbekend';
            li.textContent =
              item.url + ' (' + item.device + ') – ' + item.status + ' • ' + when;
            performanceStatusControls.queueList.appendChild(li);
          });
        }

        performanceStatusControls.historyList.innerHTML = '';
        if (!runs.length) {
          const li = document.createElement('li');
          li.textContent = 'Nog geen afgeronde audits.';
          performanceStatusControls.historyList.appendChild(li);
        } else {
          runs.forEach((run) => {
            const li = document.createElement('li');
            const when = run.completedAt ? new Date(run.completedAt).toLocaleString() : 'in uitvoering';
            const metrics = run.metrics || {};
            const performance = metrics.performance != null ? metrics.performance : '—';
            const accessibility = metrics.accessibility != null ? metrics.accessibility : '—';
            const bestPractices = metrics.bestPractices != null ? metrics.bestPractices : '—';
            const seoScore = metrics.seo != null ? metrics.seo : '—';
            li.textContent =
              when +
              ' – ' +
              run.url +
              ' (' +
              run.device +
              ') • P' +
              performance +
              ' / A' +
              accessibility +
              ' / B' +
              bestPractices +
              ' / SEO ' +
              seoScore;
            performanceStatusControls.historyList.appendChild(li);
          });
        }
      }

      async function refreshPerformanceStatus(showToastOnSuccess = false) {
        if (!performanceStatusControls) {
          return;
        }

        performanceStatusControls.card.dataset.loading = 'true';

        try {
          const response = await fetch('./api/observability/performance', {
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Kon monitoring status niet ophalen');
          }

          const payload = await response.json();
          renderPerformanceStatus(payload);

          if (showToastOnSuccess) {
            showToast('Monitoringstatus bijgewerkt');
          }
        } catch (error) {
          reportError('performance:status:refresh', error);
          showToast(error.message || 'Monitoring niet beschikbaar');
        } finally {
          delete performanceStatusControls.card.dataset.loading;
        }
      }

      async function triggerPerformanceRun() {
        if (!performanceStatusControls) {
          return;
        }

        const targets = performanceStatusControls.targets || [];
        if (!targets.length) {
          showToast('Geen audit-targets geconfigureerd');
          return;
        }

        const selectedId = performanceStatusControls.targetSelect.value;
        const selectedTarget =
          targets.find((target) => target.id === selectedId) || targets[0] || { url: '/', device: 'desktop' };

        performanceStatusControls.runButton.disabled = true;

        try {
          const response = await fetch('./api/observability/performance/run', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              url: selectedTarget.url,
              device: selectedTarget.device,
              variantId: selectedTarget.variantId || null
            })
          });

          if (!response.ok) {
            throw new Error('Kon audit niet plannen');
          }

          showToast('Audit ingepland');
          await new Promise((resolve) => setTimeout(resolve, 75));
          await refreshPerformanceStatus();
        } catch (error) {
          reportError('performance:run:schedule', error);
          showToast(error.message || 'Audit plannen mislukt');
        } finally {
          performanceStatusControls.runButton.disabled = false;
        }
      }

      function createVariantAnalyticsCard() {
        const card = document.createElement('section');
        card.className = 'field integration-card';

        const heading = document.createElement('h2');
        heading.textContent = 'Variant analytics & CRO';
        card.appendChild(heading);

        const description = document.createElement('p');
        description.className = 'hint';
        description.textContent =
          'Realtime overzicht van exposures, CTR en conversies per personalisatievariant. Gebruik dit om experimenten te sturen.';
        card.appendChild(description);

        const summaryGrid = document.createElement('dl');
        summaryGrid.className = 'status-grid';

        function createRow(label) {
          const dt = document.createElement('dt');
          dt.textContent = label;
          const dd = document.createElement('dd');
          dd.textContent = '—';
          summaryGrid.appendChild(dt);
          summaryGrid.appendChild(dd);
          return dd;
        }

        const exposuresValue = createRow('Totaal exposures');
        const ctaValue = createRow('CTA clicks');
        const conversionValue = createRow('Conversies');
        const conversionRateValue = createRow('Conversieratio');

        card.appendChild(summaryGrid);

        const updatedAt = document.createElement('p');
        updatedAt.className = 'hint';
        updatedAt.textContent = 'Laatste update: —';
        card.appendChild(updatedAt);

        const variantList = document.createElement('div');
        variantList.className = 'variant-table';
        card.appendChild(variantList);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.className = 'secondary';
        refreshButton.textContent = 'Analytics verversen';
        refreshButton.addEventListener('click', () => {
          refreshVariantAnalytics(true).catch(
            withErrorLogging('variant-analytics:status:manual-refresh')
          );
        });
        actions.appendChild(refreshButton);

        card.appendChild(actions);

        variantAnalyticsControls = {
          card,
          exposuresValue,
          ctaValue,
          conversionValue,
          conversionRateValue,
          variantList,
          refreshButton,
          updatedAt
        };

        return card;
      }

      function renderVariantAnalytics(state) {
        if (!variantAnalyticsControls) {
          return;
        }

        const totals = state?.totals || {};
        const variants = Array.isArray(state?.variants) ? state.variants : [];

        const setNumber = (element, value, suffix = '') => {
          if (typeof value === 'number' && Number.isFinite(value)) {
            element.textContent = String(value) + suffix;
          } else {
            element.textContent = '0';
          }
        };

        setNumber(variantAnalyticsControls.exposuresValue, totals.exposures || 0);
        setNumber(variantAnalyticsControls.ctaValue, totals.ctaClicks || 0);
        setNumber(variantAnalyticsControls.conversionValue, totals.conversions || 0);
        setNumber(variantAnalyticsControls.conversionRateValue, totals.conversionRate || 0, '%');

        if (state?.updatedAt) {
          variantAnalyticsControls.updatedAt.textContent =
            'Laatste update: ' + new Date(state.updatedAt).toLocaleString();
        } else {
          variantAnalyticsControls.updatedAt.textContent = 'Laatste update: onbekend';
        }

        variantAnalyticsControls.variantList.innerHTML = '';

        if (!variants.length) {
          const empty = document.createElement('p');
          empty.className = 'hint';
          empty.textContent = 'Nog geen variantdata ontvangen.';
          variantAnalyticsControls.variantList.appendChild(empty);
          return;
        }

        variants.forEach((variant) => {
          const article = document.createElement('article');

          const title = document.createElement('h3');
          title.textContent = variant.label || variant.variantId;
          article.appendChild(title);

          if (variant.experimentId) {
            const experiment = document.createElement('p');
            experiment.className = 'hint';
            experiment.textContent = 'Experiment: ' + variant.experimentId;
            article.appendChild(experiment);
          }

          const metrics = document.createElement('dl');

          const addMetric = (label, value, suffix = '') => {
            const dt = document.createElement('dt');
            dt.textContent = label;
            const dd = document.createElement('dd');
            dd.textContent = String(value) + suffix;
            metrics.appendChild(dt);
            metrics.appendChild(dd);
          };

          addMetric('Exposures', variant.exposures || 0);
          addMetric('CTA rate', (variant.ctaClickRate || 0).toFixed(2), '%');
          addMetric('Conversies', variant.conversions || 0);
          addMetric('Conversieratio', (variant.conversionRate || 0).toFixed(2), '%');

          article.appendChild(metrics);

          if (variant.matchTypes) {
            const matchSummary = Object.entries(variant.matchTypes)
              .map(([key, value]) => key + ': ' + value)
              .join(' • ');
            if (matchSummary) {
              const matchParagraph = document.createElement('p');
              matchParagraph.className = 'hint';
              matchParagraph.textContent = 'Match types: ' + matchSummary;
              article.appendChild(matchParagraph);
            }
          }

          if (Array.isArray(variant.topKeywords) && variant.topKeywords.length) {
            const keywords = document.createElement('p');
            keywords.className = 'keywords';
            keywords.textContent =
              'Top keywords: ' +
              variant.topKeywords.map((item) => item.keyword + ' (' + item.count + ')').join(', ');
            article.appendChild(keywords);
          }

          variantAnalyticsControls.variantList.appendChild(article);
        });
      }

      async function refreshVariantAnalytics(showToastOnSuccess = false) {
        if (!variantAnalyticsControls) {
          return;
        }

        variantAnalyticsControls.card.dataset.loading = 'true';

        try {
          const response = await fetch('./api/observability/variants', {
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Kon variant analytics niet laden');
          }

          const payload = await response.json();
          renderVariantAnalytics(payload);

          if (showToastOnSuccess) {
            showToast('Variant analytics bijgewerkt');
          }
        } catch (error) {
          reportError('variant-analytics:status:refresh', error);
          showToast(error.message || 'Variant analytics niet beschikbaar');
        } finally {
          delete variantAnalyticsControls.card.dataset.loading;
        }
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
            formatDateTime(success.at) + ' - ' + resource + ' (' + attempts + ' poging(en))';
        } else {
          rentGuyStatusControls.lastSuccessValue.textContent = 'Nog geen succesvolle sync';
        }

        if (status && status.lastSyncError) {
          const errorInfo = status.lastSyncError;
          const message = errorInfo.message || 'Onbekende fout';
          rentGuyStatusControls.lastErrorValue.textContent =
            formatDateTime(errorInfo.at) + ' - ' + message;
        } else {
          rentGuyStatusControls.lastErrorValue.textContent = 'Geen fouten geregistreerd';
        }

        if (status && status.nextInQueue) {
          const next = status.nextInQueue;
          const resource = next.resource || 'onbekend';
          const attempts = Number.isFinite(next.attempts) ? next.attempts : 0;
          rentGuyStatusControls.nextRetryValue.textContent =
            formatDateTime(next.enqueuedAt) + ' - ' + resource + ' (' + attempts + ' poging(en))';
        } else {
          rentGuyStatusControls.nextRetryValue.textContent = 'Geen wachtrij';
        }

        rentGuyStatusControls.flushButton.disabled = !configured || queueSize === 0;
      }

      function renderSevensaStatus(status) {
        if (!sevensaStatusControls) {
          return;
        }

        const configured = Boolean(status && status.configured);
        sevensaStatusControls.indicator.dataset.state = configured ? 'configured' : 'missing';
        sevensaStatusControls.indicator.textContent = configured
          ? 'Submit URL actief'
          : 'Submit URL ontbreekt';

        const queueSize = status && Number.isFinite(status.queueSize) ? status.queueSize : 0;
        sevensaStatusControls.queueValue.textContent = String(queueSize);

        const deadLetters = status && Number.isFinite(status.deadLetterCount) ? status.deadLetterCount : 0;
        sevensaStatusControls.deadLetterValue.textContent = String(deadLetters);

        if (status && status.nextInQueue) {
          const next = status.nextInQueue;
          const attempts = Number.isFinite(next.attempts) ? next.attempts : 0;
          const detail = next.lastError ? ' - ' + next.lastError : '';
          sevensaStatusControls.nextAttemptValue.textContent =
            formatDateTime(next.nextAttemptAt) + ' - poging ' + attempts + detail;
        } else {
          sevensaStatusControls.nextAttemptValue.textContent = 'Geen wachtrij actief';
        }

        if (status && status.lastDeadLetter) {
          const dead = status.lastDeadLetter;
          const message = dead.lastError || 'Onbekende fout';
          sevensaStatusControls.lastErrorValue.textContent =
            formatDateTime(dead.droppedAt) + ' - ' + message;
        } else if (status && status.nextInQueue && status.nextInQueue.lastError) {
          sevensaStatusControls.lastErrorValue.textContent = status.nextInQueue.lastError;
        } else {
          sevensaStatusControls.lastErrorValue.textContent = 'Geen fouten geregistreerd';
        }

        sevensaStatusControls.flushButton.disabled = !configured || queueSize === 0;
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
          reportError('rentguy:status:refresh', error);
          showToast(error.message || 'RentGuy status niet beschikbaar');
        } finally {
          delete rentGuyStatusControls.card.dataset.loading;
        }
      }

      async function refreshSevensaStatus(showToastOnSuccess = false) {
        if (!sevensaStatusControls) {
          return;
        }

        sevensaStatusControls.card.dataset.loading = 'true';
        sevensaStatusControls.resultMessage.textContent = '';

        try {
          const response = await fetch('./api/integrations/sevensa/status', {
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) {
            throw new Error('Kon Sevensa status niet ophalen');
          }

          const payload = await response.json();
          renderSevensaStatus(payload);
          if (showToastOnSuccess) {
            showToast('Sevensa status bijgewerkt');
          }
        } catch (error) {
          reportError('sevensa:status:refresh', error);
          sevensaStatusControls.resultMessage.textContent = error.message || 'Sevensa status niet beschikbaar';
          showToast(error.message || 'Sevensa status niet beschikbaar');
        } finally {
          delete sevensaStatusControls.card.dataset.loading;
        }
      }

      async function flushSevensaQueue() {
        if (!sevensaStatusControls) {
          return;
        }

        sevensaStatusControls.card.dataset.loading = 'true';
        sevensaStatusControls.resultMessage.textContent = '';

        try {
          const response = await fetch('./api/integrations/sevensa/flush', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({})
          });

          if (!response.ok) {
            throw new Error('Kon Sevensa queue niet flushen');
          }

          const payload = await response.json();
          if (!payload.configured) {
            sevensaStatusControls.resultMessage.textContent =
              'Submit URL ontbreekt – configureer eerst de Sevensa submit URL.';
            showToast('Sevensa flush overgeslagen: configureer de submit URL');
            await refreshSevensaStatus();
            return;
          }

          sevensaStatusControls.resultMessage.textContent =
            'Flush uitgevoerd: ' +
            payload.delivered +
            '/' +
            payload.attempted +
            ' verstuurd, ' +
            payload.remaining +
            ' resterend.';
          showToast('Sevensa queue flush uitgevoerd');
          await refreshSevensaStatus();
        } catch (error) {
          reportError('sevensa:queue:flush', error);
          sevensaStatusControls.resultMessage.textContent = error.message || 'Flush mislukt';
          showToast(error.message || 'Sevensa flush mislukt');
          try {
            await refreshSevensaStatus();
          } catch (refreshError) {
            reportError('sevensa:status:refresh-after-flush', refreshError);
          }
        } finally {
          delete sevensaStatusControls.card.dataset.loading;
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
          reportError('rentguy:queue:flush', error);
          rentGuyStatusControls.resultMessage.textContent = error.message || 'Flush mislukt';
          showToast(error.message || 'Flush mislukt');
          try {
            await refreshRentGuyStatus();
          } catch (refreshError) {
            reportError('rentguy:status:refresh-after-flush', refreshError);
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
        } else if (group.id === 'automation') {
          section.appendChild(createSevensaStatusCard());
          section.appendChild(createPerformanceStatusCard());
        } else if (group.id === 'personalization') {
          section.appendChild(createVariantAnalyticsCard());
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
        sevensaStatusControls = null;
        performanceStatusControls = null;
        variantAnalyticsControls = null;

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
          refreshRentGuyStatus().catch(withErrorLogging('rentguy:status:initial-load'));
        }

        if (sevensaStatusControls) {
          refreshSevensaStatus().catch(withErrorLogging('sevensa:status:initial-load'));
        }

        if (performanceStatusControls) {
          refreshPerformanceStatus().catch(
            withErrorLogging('performance:status:initial-load')
          );
        }

        if (variantAnalyticsControls) {
          refreshVariantAnalytics().catch(
            withErrorLogging('variant-analytics:status:initial-load')
          );
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
        roles = normalizeRoles(payload.roles);
        roleAssignments = normalizeAssignmentsMap(payload.roleAssignments);
        roleAssignments = serializeAssignments();
        renderRolesPanel();
        managedKeys = Array.isArray(payload.managedKeys) ? payload.managedKeys : [];
        renderGroups(Array.isArray(payload.groups) ? payload.groups : []);
        form.dataset.rolesDirty = 'false';
        if (rolesPanel) {
          delete rolesPanel.dataset.dirty;
        }

        const metadataItems = [];
        if (payload.metadata?.lastModified) {
          metadataItems.push('Laatst bijgewerkt: ' + new Date(payload.metadata.lastModified).toLocaleString());
        }
        if (payload.metadata?.storePath) {
          metadataItems.push('Opslagbestand: ' + payload.metadata.storePath);
        }
        metadataEl.textContent = metadataItems.join(' - ');
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
            body: JSON.stringify({ entries: payload, assignments: serializeAssignments() })
          });

          if (!response.ok) {
            throw new Error('Opslaan mislukt');
          }

          await loadState();
          showToast('Configuratie opgeslagen');
        } catch (error) {
          reportError('dashboard:form:submit', error);
          showToast(error.message || 'Er ging iets mis');
        }
      });

      loadState().catch((error) => {
        reportError('dashboard:state:initial-load', error);
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
    const assignments = req.body?.assignments;

    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    const state = await configDashboardService.updateValues(entries, { assignments });
    res.json(state);
  } catch (error) {
    next(error);
  }
});

router.get('/api/roles', async (_req, res, next) => {
  try {
    const data = await configDashboardService.listRoles();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/api/roles', async (req, res, next) => {
  try {
    const result = await configDashboardService.createRole(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    if (
      error.message === 'Invalid role payload' ||
      error.message === 'Role name is required' ||
      error.message === 'Role already exists' ||
      error.message === 'Unable to determine role identifier'
    ) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.put('/api/roles/:roleId', async (req, res, next) => {
  try {
    const result = await configDashboardService.updateRole(req.params.roleId, req.body || {});
    res.json(result);
  } catch (error) {
    if (error.message === 'Role identifier is required' || error.message === 'Role name is required' || error.message === 'Invalid role payload') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.message === 'Role not found') {
      res.status(404).json({ error: error.message });
      return;
    }

    next(error);
  }
});

router.delete('/api/roles/:roleId', async (req, res, next) => {
  try {
    const result = await configDashboardService.deleteRole(req.params.roleId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Role identifier is required') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.message === 'Role not found') {
      res.status(404).json({ error: error.message });
      return;
    }

    next(error);
  }
});

router.get('/api/integrations/rentguy/status', async (_req, res, next) => {
  try {
    const status = await rentGuyService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
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

router.get('/api/integrations/sevensa/status', async (_req, res, next) => {
  try {
    const status = await sevensaService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.post('/api/integrations/sevensa/flush', async (req, res, next) => {
  try {
    const rawLimit = req.body?.limit;
    const parsedLimit = Number(rawLimit);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;
    const result = await sevensaService.flushQueue(limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/api/observability/performance', async (_req, res, next) => {
  try {
    const state = await observabilityService.getMonitoringState();
    res.json(state);
  } catch (error) {
    next(error);
  }
});

router.post('/api/observability/performance/run', async (req, res, next) => {
  try {
    const entry = await observabilityService.scheduleRun({
      url: req.body?.url,
      device: req.body?.device,
      variantId: req.body?.variantId || null,
      trigger: 'dashboard',
      tools: Array.isArray(req.body?.tools) ? req.body.tools : undefined
    });

    res.status(202).json({ scheduled: true, entry });
  } catch (error) {
    next(error);
  }
});

router.get('/api/observability/variants', async (_req, res, next) => {
  try {
    const analytics = await observabilityService.getVariantAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

router.post('/log', (req, res) => {
  const { context, message, stack, name, details } = req.body || {};
  const logContext = {
    route: 'dashboard',
    source: 'dashboard-client',
    context: context || 'unknown',
    client: {
      name: name || undefined,
      stack: stack || undefined,
      details: details || undefined
    },
    ip: req.ip,
    userAgent: req.headers['user-agent'] || undefined
  };

  const logMessage = message || 'Dashboard client reported an error';
  logger.error(logMessage, logContext);
  res.status(204).end();
});

module.exports = router;
