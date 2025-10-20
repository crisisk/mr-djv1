const fs = require('fs');
const path = require('path');
const config = require('../config');
const managedEnv = require('../lib/managedEnv');

const DEFAULT_ROLES_STORE = path.resolve(
  path.dirname(managedEnv.DEFAULT_STORE_PATH || managedEnv.getStorePath()),
  'dashboard-roles.json'
);

function getRolesStorePath() {
  if (process.env.CONFIG_DASHBOARD_ROLES_PATH) {
    return path.resolve(process.cwd(), process.env.CONFIG_DASHBOARD_ROLES_PATH);
  }

  return DEFAULT_ROLES_STORE;
}

function slugify(value) {
  if (!value) {
    return '';
  }

  return value
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

function normalizePermissions(rawPermissions) {
  if (!Array.isArray(rawPermissions)) {
    return [];
  }

  const unique = new Set();

  rawPermissions.forEach((item) => {
    if (typeof item !== 'string') {
      return;
    }

    const trimmed = item.trim();

    if (trimmed) {
      unique.add(trimmed);
    }
  });

  return [...unique];
}

function normalizeRoleFromStore(rawRole) {
  if (!rawRole || typeof rawRole !== 'object') {
    return null;
  }

  const id = typeof rawRole.id === 'string' ? slugify(rawRole.id.trim()) : '';
  const name = typeof rawRole.name === 'string' ? rawRole.name.trim() : '';

  if (!id || !name) {
    return null;
  }

  const description = typeof rawRole.description === 'string' ? rawRole.description.trim() : '';

  return {
    id,
    name,
    description,
    permissions: normalizePermissions(rawRole.permissions)
  };
}

function sanitizeAssignments(rawAssignments, roles) {
  if (!rawAssignments || typeof rawAssignments !== 'object' || Array.isArray(rawAssignments)) {
    return {};
  }

  const validRoleIds = new Set((roles || []).map((role) => role.id));
  const normalized = {};

  for (const [key, value] of Object.entries(rawAssignments)) {
    if (!Array.isArray(value)) {
      continue;
    }

    const roleIds = value
      .map((roleId) => (typeof roleId === 'string' ? roleId.trim() : ''))
      .filter((roleId) => roleId && validRoleIds.has(roleId));

    if (!roleIds.length) {
      continue;
    }

    const uniqueIds = [...new Set(roleIds)].sort((a, b) => a.localeCompare(b));
    normalized[key] = uniqueIds;
  }

  return normalized;
}

function loadRolesStore() {
  const filePath = getRolesStorePath();

  if (!fs.existsSync(filePath)) {
    return { roles: [], assignments: {} };
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');

    if (!raw.trim()) {
      return { roles: [], assignments: {} };
    }

    const parsed = JSON.parse(raw);
    const roles = Array.isArray(parsed.roles)
      ? parsed.roles
          .map((role) => normalizeRoleFromStore(role))
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
      : [];

    const assignments = sanitizeAssignments(parsed.assignments, roles);

    return {
      roles,
      assignments
    };
  } catch (error) {
    console.warn('[configDashboardService] Failed to read roles store:', error.message);
    return { roles: [], assignments: {} };
  }
}

async function writeRolesStore(store) {
  const filePath = getRolesStorePath();
  const payload = {
    roles: Array.isArray(store.roles) ? store.roles : [],
    assignments: store.assignments && typeof store.assignments === 'object' ? store.assignments : {}
  };

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(payload, null, 2), { mode: 0o600 });

  return loadRolesStore();
}

function getRoleById(roles, roleId) {
  return roles.find((role) => role.id === roleId);
}

function ensureRoleName(name) {
  if (typeof name !== 'string') {
    throw new Error('Role name is required');
  }

  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error('Role name is required');
  }

  return trimmed;
}

function normalizeRolePayload(payload, { requireId = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid role payload');
  }

  const name = ensureRoleName(payload.name);
  let id = typeof payload.id === 'string' ? slugify(payload.id) : '';

  if (!id) {
    id = slugify(name);
  }

  if (!id && requireId) {
    throw new Error('Role identifier is required');
  }

  if (!id) {
    throw new Error('Unable to determine role identifier');
  }

  const description = typeof payload.description === 'string' ? payload.description.trim() : '';

  return {
    id,
    name,
    description,
    permissions: normalizePermissions(payload.permissions)
  };
}

async function updateRoleAssignments(assignments) {
  if (assignments === undefined) {
    return loadRolesStore();
  }

  const store = loadRolesStore();
  store.assignments = sanitizeAssignments(assignments, store.roles);
  return writeRolesStore(store);
}

function maskValue(value) {
  if (!value) {
    return null;
  }

  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }

  const visible = value.slice(-4);
  return `${'*'.repeat(value.length - 4)}${visible}`;
}

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  return value;
}

function getCurrentValues() {
  const fileValues = managedEnv.loadFromDiskSync();
  return { ...fileValues };
}

function buildState(values, roleState = loadRolesStore()) {
  const entryMap = new Map();
  const entries = config.dashboard.managedKeys.map((key) => {
    const existing = values[key];
    const effective = existing ?? process.env[key] ?? null;

    const entry = {
      name: key,
      hasValue: Boolean(effective),
      preview: effective ? maskValue(String(effective)) : null
    };

    entryMap.set(key, entry);
    return entry;
  });

  const groups = (config.dashboard.sections || []).map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
    entries: section.keys.map((key) => entryMap.get(key)).filter(Boolean)
  }));

  let lastModified = null;
  const storePath = managedEnv.getStorePath();
  try {
    const stats = fs.statSync(storePath);
    lastModified = stats.mtime.toISOString();
  } catch (_error) {
    lastModified = null;
  }

  return {
    managedKeys: [...config.dashboard.managedKeys],
    entries,
    groups,
    metadata: {
      storePath: path.relative(process.cwd(), storePath),
      lastModified
    },
    roles: roleState.roles,
    roleAssignments: roleState.assignments
  };
}

async function updateValues(payload, { assignments } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid payload');
  }

  const currentValues = getCurrentValues();
  const nextValues = { ...currentValues };

  for (const key of config.dashboard.managedKeys) {
    if (!(key in payload)) {
      continue;
    }

    const rawValue = normalizeValue(payload[key]);

    if (rawValue === null) {
      continue;
    }

    if (rawValue === '') {
      delete nextValues[key];
      delete process.env[key];
      continue;
    }

    nextValues[key] = rawValue;
    process.env[key] = rawValue;
  }

  await managedEnv.write(nextValues);
  config.reload();

  const roleState = await updateRoleAssignments(assignments);

  return buildState(nextValues, roleState);
}

function getState() {
  const values = getCurrentValues();
  return buildState(values);
}

function listRoles() {
  return loadRolesStore();
}

async function createRole(payload) {
  const store = loadRolesStore();
  const role = normalizeRolePayload(payload);

  if (getRoleById(store.roles, role.id)) {
    throw new Error('Role already exists');
  }

  store.roles.push(role);
  store.roles.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  store.assignments = sanitizeAssignments(store.assignments, store.roles);

  const updatedStore = await writeRolesStore(store);
  return { role: getRoleById(updatedStore.roles, role.id), roles: updatedStore.roles, assignments: updatedStore.assignments };
}

async function updateRole(roleId, payload) {
  if (typeof roleId !== 'string' || !roleId.trim()) {
    throw new Error('Role identifier is required');
  }

  const store = loadRolesStore();
  const existing = getRoleById(store.roles, slugify(roleId.trim()));

  if (!existing) {
    throw new Error('Role not found');
  }

  if (payload?.name !== undefined) {
    existing.name = ensureRoleName(payload.name);
  }

  if (payload?.description !== undefined) {
    existing.description = typeof payload.description === 'string' ? payload.description.trim() : '';
  }

  if (payload?.permissions !== undefined) {
    existing.permissions = normalizePermissions(payload.permissions);
  }

  store.roles = store.roles
    .map((role) => (role.id === existing.id ? existing : role))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  store.assignments = sanitizeAssignments(store.assignments, store.roles);

  const updatedStore = await writeRolesStore(store);
  return { role: getRoleById(updatedStore.roles, existing.id), roles: updatedStore.roles, assignments: updatedStore.assignments };
}

async function deleteRole(roleId) {
  if (typeof roleId !== 'string' || !roleId.trim()) {
    throw new Error('Role identifier is required');
  }

  const store = loadRolesStore();
  const normalizedId = slugify(roleId.trim());
  const index = store.roles.findIndex((role) => role.id === normalizedId);

  if (index === -1) {
    throw new Error('Role not found');
  }

  const [removed] = store.roles.splice(index, 1);

  for (const [key, values] of Object.entries(store.assignments)) {
    const nextValues = values.filter((value) => value !== normalizedId);
    if (nextValues.length) {
      store.assignments[key] = nextValues;
    } else {
      delete store.assignments[key];
    }
  }

  const updatedStore = await writeRolesStore(store);

  return { role: removed, roles: updatedStore.roles, assignments: updatedStore.assignments };
}

module.exports = {
  getState,
  updateValues,
  listRoles,
  createRole,
  updateRole,
  deleteRole
};
