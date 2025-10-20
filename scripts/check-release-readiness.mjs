#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import { readFile, stat } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const checklistPath = path.join(repoRoot, 'docs', 'go-live-checklist.md');

const allowedPrefixes = new Set(['backend', 'frontend', 'database']);
const allowedStandalone = new Set(['deploy.sh', 'NETLIFY_DEPLOYMENT.md']);

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command \"${command} ${args.join(' ')}\" exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function toRepoRelative(rawPath, { base = repoRoot } = {}) {
  let normalized = rawPath.trim();
  if (!normalized) return null;
  normalized = normalized.replace(/\\/g, '/');
  if (normalized.startsWith('#')) return null;
  if (/^[a-z]+:\/\//i.test(normalized)) return null;
  if (normalized.startsWith('mailto:')) return null;
  if (normalized.startsWith('/')) return null;

  let absolute;
  if (normalized.startsWith('../') || normalized.startsWith('./')) {
    absolute = path.resolve(base, normalized);
  } else {
    absolute = path.resolve(repoRoot, normalized);
  }

  const relative = path.relative(repoRoot, absolute).replace(/\\/g, '/');
  if (!relative || relative.startsWith('..')) {
    return null;
  }

  return relative;
}

function shouldKeepPath(relativePath) {
  if (relativePath.includes('coverage/')) return false;
  if (relativePath.includes('.env') && !relativePath.includes('.env.example')) return false;

  const segments = relativePath.split('/');
  if (segments.length === 1) {
    return allowedStandalone.has(relativePath);
  }

  return allowedPrefixes.has(segments[0]);
}

async function collectChecklistArtifacts() {
  const markdown = await readFile(checklistPath, 'utf8');
  const docDir = path.dirname(checklistPath);
  const artifacts = new Map();

  const addArtifact = (rawPath, source) => {
    const relative = toRepoRelative(rawPath, { base: source === 'link' ? docDir : repoRoot });
    if (!relative) return;
    if (!shouldKeepPath(relative)) return;
    if (!artifacts.has(relative)) {
      artifacts.set(relative, new Set());
    }
    artifacts.get(relative).add(source);
  };

  const linkRegex = /\[[^\]]*\]\((?!https?:|mailto:)([^)#?]+)(?:#[^)]+)?(?:\?[^)]+)?\)/g;
  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    addArtifact(match[1], 'link');
  }

  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(markdown)) !== null) {
    const snippet = match[1].trim();
    if (!snippet) continue;
    if (snippet.includes(' ')) continue;
    if (snippet.includes('*')) continue;
    if (snippet.startsWith('/')) continue;
    if (/^[A-Z0-9_]+$/i.test(snippet) && !snippet.includes('.')) continue;
    addArtifact(snippet, 'code');
  }

  const textPathRegex = /\b(?!https?:\/\/)([A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)+(?:\.[A-Za-z0-9._-]+)?)\b/g;
  while ((match = textPathRegex.exec(markdown)) !== null) {
    addArtifact(match[1], 'text');
  }

  return artifacts;
}

async function ensureArtifactsExist(artifacts) {
  const missing = [];
  for (const relativePath of artifacts.keys()) {
    const absolute = path.join(repoRoot, relativePath);
    try {
      const stats = await stat(absolute);
      if (!stats.isFile() && !stats.isDirectory()) {
        missing.push(relativePath);
      }
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        missing.push(relativePath);
      } else {
        throw error;
      }
    }
  }

  if (missing.length > 0) {
    const formatted = missing.map((item) => ` - ${item}`).join('\n');
    throw new Error(`The following artifacts referenced in docs/go-live-checklist.md are missing:\n${formatted}`);
  }
}

async function main() {
  console.log('🔍 Running release readiness checks...');

  console.log('\n➡️  Linting frontend');
  await runCommand('npm', ['run', 'lint'], {
    cwd: path.join(repoRoot, 'frontend'),
    env: { ...process.env, CI: 'true' },
  });

  console.log('\n➡️  Running backend tests');
  await runCommand('npm', ['test'], {
    cwd: path.join(repoRoot, 'backend'),
    env: { ...process.env, CI: 'true' },
  });

  console.log('\n➡️  Building frontend');
  await runCommand('npm', ['run', 'build'], {
    cwd: path.join(repoRoot, 'frontend'),
    env: { ...process.env, CI: 'true' },
  });

  console.log('\n📋 Validating go-live checklist artifacts');
  const artifacts = await collectChecklistArtifacts();
  await ensureArtifactsExist(artifacts);
  if (artifacts.size > 0) {
    console.log('Required artifacts found:');
    for (const relativePath of artifacts.keys()) {
      console.log(` - ${relativePath}`);
    }
  } else {
    console.log('No artifacts detected in docs/go-live-checklist.md.');
  }

  console.log('\n✅ Release readiness checks passed.');
}

main().catch((error) => {
  console.error('\n❌ Release readiness check failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
