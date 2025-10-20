#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'release-notes.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'changelog.html');
const COMPONENT_DATA_FILE = path.join(
  __dirname,
  '..',
  'mr-dj-eds-components',
  'src',
  'data',
  'releaseNotes.json'
);

const typeClassMap = {
  FEAT: 'type-feat',
  FIX: 'type-fix',
  DOCS: 'type-docs',
};

const statusOpacityMap = {
  current: 1,
  upcoming: 0.7,
  future: 0.5,
};

function loadReleaseNotes() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Release notes not found at ${DATA_FILE}`);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.versions)) {
    throw new Error('Invalid release notes format: "versions" must be an array.');
  }

  return parsed;
}

function sortVersions(versions) {
  return [...versions].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

function renderVersion({ version, note, date, status = 'current', changes = [] }) {
  const opacity = statusOpacityMap[status] ?? 1;
  const opacityAttr = opacity === 1 ? '' : ` style="opacity: ${opacity};"`;
  const versionLabel = note ? `${version} (${note})` : version;

  const items = changes
    .map((change) => {
      const type = (change.type || '').toUpperCase();
      const typeClass = typeClassMap[type] || 'type-docs';
      const description = change.description || '';
      return `                    <li><span class="update-type ${typeClass}">${type}</span> ${description}</li>`;
    })
    .join('\n');

  return [
    `            <div class="version-box"${opacityAttr}>`,
    '                <div class="version-header">',
    `                    <div class="version-number">${versionLabel}</div>`,
    `                    <div class="version-date">${date || ''}</div>`,
    '                </div>',
    '                <ul class="update-list">',
    items,
    '                </ul>',
    '            </div>',
  ].join('\n');
}

function buildHtml({ title, subtitle }, versions) {
  const versionHtml = versions.map(renderVersion).join('\n\n');

  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .slide-container {
            width: 1280px;
            min-height: 720px;
            background: #FFFFFF;
            padding: 30px 40px;
            display: flex;
            flex-direction: column;
        }

        h1 {
            font-size: 42px;
            font-weight: 900;
            color: #1A2C4B;
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 25px;
        }

        .changelog-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            flex: 1;
            overflow-y: auto;
        }

        .version-box {
            border: 2px solid #E5E5E5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .version-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #00AEEF;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }

        .version-number {
            font-size: 24px;
            font-weight: 900;
            color: #1A2C4B;
        }

        .version-date {
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }

        .update-list {
            list-style-type: none;
            padding: 0;
        }

        .update-list li {
            font-size: 14px;
            color: #1A2C4B;
            margin-bottom: 5px;
            display: flex;
            align-items: flex-start;
        }

        .update-type {
            font-weight: 800;
            width: 60px;
            margin-right: 10px;
            padding: 2px 5px;
            border-radius: 4px;
            text-align: center;
            color: white;
        }

        .type-feat { background: #00AEEF; }
        .type-fix { background: #FF4D4D; }
        .type-docs { background: #D4AF37; color: #1A2C4B; }
    </style>
</head>
<body>
    <div class="slide-container">
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>

        <div class="changelog-grid">
${versionHtml}
        </div>
    </div>
</body>
</html>
`;
}

function writeReactData(data, versions) {
  const payload = {
    title: data.title,
    subtitle: data.subtitle,
    versions,
  };

  fs.mkdirSync(path.dirname(COMPONENT_DATA_FILE), { recursive: true });
  fs.writeFileSync(COMPONENT_DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
  try {
    const data = loadReleaseNotes();
    const versions = sortVersions(data.versions);
    const html = buildHtml(data, versions);

    fs.writeFileSync(OUTPUT_FILE, html);
    writeReactData(data, versions);

    console.log(`Changelog written to ${OUTPUT_FILE}`);
    console.log(`Component data written to ${COMPONENT_DATA_FILE}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
