#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const REPLICATE_API_KEY = 'r8_SYVAt2n0lxjFOb2ACWpltmFt4KddG7i2ZTKaM';
const OPENROUTER_API_KEY = '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';

const EDS_COMPONENTS_DIR = '/srv/apps/mr-djv1/mr-dj-eds-components/src/components';
const OUTPUT_DIR = '/srv/apps/mr-djv1/dynamic-api/components';
const PROJECT_DIR = '/srv/apps/mr-djv1/dynamic-api';

// Parallel processing configuration
const PARALLEL_BATCH_SIZE = 5;  // Process 5 components at once
const BATCH_COOLDOWN_MS = 15000; // 15s cooldown between batches
const REQUEST_DELAY_MS = 2000;   // 2s delay between individual API calls in a batch

const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'];
const BUTTON_SIZES = ['sm', 'md', 'lg'];

const MODELS = {
  openrouter: [
    'anthropic/claude-sonnet-4.5',
    'openai/gpt-4',
    'google/gemini-2.5-flash-preview-09-2025',
  ]
};

function getAllEDSComponents() {
  const components = [];
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.jsx')) {
        const relativePath = path.relative(EDS_COMPONENTS_DIR, fullPath);
        components.push({
          name: path.basename(item, '.jsx'),
          path: fullPath,
          relativePath: relativePath,
          category: path.dirname(relativePath),
        });
      }
    }
  }
  scanDirectory(EDS_COMPONENTS_DIR);
  return components;
}

function getImplementedComponents() {
  const implemented = new Set();
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx')) {
        implemented.add(path.basename(item, '.tsx').toLowerCase());
      }
    }
  }
  scanDirectory(OUTPUT_DIR);
  return implemented;
}

// Rate-limited API caller
let lastAPICallTime = 0;
async function callOpenRouterRateLimited(prompt, model, componentIndex) {
  // Stagger requests in a batch
  const delay = componentIndex * REQUEST_DELAY_MS;
  await new Promise(resolve => setTimeout(resolve, delay));

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mr-dj.sevensa.nl',
      'X-Title': 'Mr DJ Component Generator',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert React/Next.js developer. Return ONLY valid TypeScript code without markdown formatting.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 6000,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  lastAPICallTime = Date.now();
  return data.choices[0].message.content;
}

function generateImprovedPrompt(componentName, sourceCode, category) {
  return `Convert this React JSX component to TypeScript TSX for Next.js 14.

CRITICAL: Return ONLY TypeScript code. NO markdown blocks, NO explanations.

Component: ${componentName} (${category})

Source:
${sourceCode.slice(0, 3000)}

Requirements:
1. TypeScript with proper interfaces
2. 'use client' ONLY if using hooks/events
3. Design tokens: text-primary, bg-primary, spacing-xs/sm/md/lg/xl
4. Button variants: ONLY ${BUTTON_VARIANTS.join(', ')}
5. Button sizes: ONLY ${BUTTON_SIZES.join(', ')}
6. NO SlideLayout imports
7. Relative imports: '../ui/Button'
8. WCAG AA accessibility

Return production-ready TypeScript code now:`;
}

function cleanGeneratedCode(code) {
  let cleaned = code.trim();

  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:tsx|typescript|ts)?\n([\s\S]*?)```/);
    if (match) cleaned = match[1].trim();
  }

  const lines = cleaned.split('\n');
  let startIndex = 0;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith("'use client'") ||
        line.startsWith('"use client"') || line.startsWith('export ')) {
      startIndex = i;
      break;
    }
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line === '}' || line === '};' || line.startsWith('export default')) {
      endIndex = i + 1;
      break;
    }
  }

  cleaned = lines.slice(startIndex, endIndex).join('\n');

  if (!cleaned.includes('export default')) {
    throw new Error('No default export found');
  }

  const issues = [];
  if (cleaned.includes('variant="outline"')) issues.push('Invalid Button variant "outline"');
  if (cleaned.includes('size="icon"')) issues.push('Invalid Button size "icon"');
  if (cleaned.includes('SlideLayout')) issues.push('Reference to non-existent SlideLayout');

  if (issues.length > 0) {
    throw new Error(`Validation failed: ${issues.join(', ')}`);
  }

  return cleaned;
}

async function verifyTypeScript(filePath) {
  try {
    await execAsync(`npx tsc --noEmit --jsx react-jsx "${filePath}"`, {
      cwd: PROJECT_DIR,
      timeout: 30000
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function processComponent(component, batchIndex) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`  [${component.name}] Attempt ${attempt}/${maxAttempts}`);

      const implemented = getImplementedComponents();
      if (implemented.has(component.name.toLowerCase())) {
        console.log(`  [${component.name}] ✅ Already exists`);
        return { success: true, skipped: true };
      }

      const sourceCode = fs.readFileSync(component.path, 'utf-8');
      const prompt = generateImprovedPrompt(component.name, sourceCode, component.category);

      const modelIndex = (attempt - 1) % MODELS.openrouter.length;
      const model = MODELS.openrouter[modelIndex];

      let generatedCode = await callOpenRouterRateLimited(prompt, model, batchIndex);

      try {
        generatedCode = cleanGeneratedCode(generatedCode);
      } catch (cleanError) {
        if (attempt < maxAttempts) {
          console.log(`  [${component.name}] ⚠️ Validation failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw cleanError;
      }

      let outputPath;
      const lowerCategory = component.category.toLowerCase();

      if (lowerCategory.includes('ui')) {
        outputPath = path.join(OUTPUT_DIR, 'ui', `${component.name}.tsx`);
      } else if (lowerCategory.includes('organism')) {
        outputPath = path.join(OUTPUT_DIR, 'organisms', `${component.name}.tsx`);
      } else if (lowerCategory.includes('molecule')) {
        outputPath = path.join(OUTPUT_DIR, 'molecules', `${component.name}.tsx`);
      } else if (lowerCategory.includes('atom')) {
        outputPath = path.join(OUTPUT_DIR, 'atoms', `${component.name}.tsx`);
      } else if (lowerCategory.includes('template') || lowerCategory.includes('page')) {
        outputPath = path.join(OUTPUT_DIR, 'templates', `${component.name}.tsx`);
      } else if (lowerCategory.includes('section')) {
        outputPath = path.join(OUTPUT_DIR, 'sections', `${component.name}.tsx`);
      } else if (lowerCategory.includes('pattern')) {
        outputPath = path.join(OUTPUT_DIR, 'patterns', `${component.name}.tsx`);
      } else {
        outputPath = path.join(OUTPUT_DIR, 'ui', `${component.name}.tsx`);
      }

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, generatedCode, 'utf-8');

      const verification = await verifyTypeScript(outputPath);
      if (!verification.success) {
        if (attempt < maxAttempts) {
          fs.unlinkSync(outputPath);
          console.log(`  [${component.name}] ⚠️ TypeScript error, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw new Error('TypeScript compilation failed');
      }

      console.log(`  [${component.name}] ✅ Generated`);
      return { success: true, path: outputPath };

    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(`  [${component.name}] ❌ Failed: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  }

  return { success: false, error: 'Max attempts exceeded' };
}

async function main() {
  console.log('🚀 Parallel Component Generation\n');
  console.log(`⚙️  Configuration:`);
  console.log(`   - Batch size: ${PARALLEL_BATCH_SIZE} components`);
  console.log(`   - Batch cooldown: ${BATCH_COOLDOWN_MS}ms`);
  console.log(`   - Request stagger: ${REQUEST_DELAY_MS}ms\n`);

  const allComponents = getAllEDSComponents();
  const implemented = getImplementedComponents();
  const toGenerate = allComponents.filter(c => !implemented.has(c.name.toLowerCase()));

  console.log(`📦 Found ${allComponents.length} components`);
  console.log(`✅ Already implemented: ${implemented.size}`);
  console.log(`🎯 To generate: ${toGenerate.length}\n`);

  if (toGenerate.length === 0) {
    console.log('✨ All components implemented!');
    return;
  }

  const priority = ['badge', 'avatar', 'skeleton', 'alert', 'progress', 'checkbox',
                    'radio-group', 'select', 'input', 'textarea', 'PricingTables', 'ServicePage'];

  const priorityComponents = toGenerate.filter(c =>
    priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );
  const otherComponents = toGenerate.filter(c =>
    !priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );

  const allToProcess = [...priorityComponents, ...otherComponents];
  const results = { success: 0, failed: 0, skipped: 0, errors: [] };

  // Process in batches
  for (let i = 0; i < allToProcess.length; i += PARALLEL_BATCH_SIZE) {
    const batch = allToProcess.slice(i, i + PARALLEL_BATCH_SIZE);
    const batchNum = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allToProcess.length / PARALLEL_BATCH_SIZE);

    console.log(`\n🔄 Batch ${batchNum}/${totalBatches}: ${batch.map(c => c.name).join(', ')}`);

    // Process batch in parallel
    const batchPromises = batch.map((component, idx) =>
      processComponent(component, idx)
    );

    const batchResults = await Promise.all(batchPromises);

    // Aggregate results
    batchResults.forEach((result, idx) => {
      if (result.skipped) {
        results.skipped++;
      } else if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ component: batch[idx].name, error: result.error });
      }
    });

    // Progress
    const processed = Math.min(i + PARALLEL_BATCH_SIZE, allToProcess.length);
    const progress = ((processed / allToProcess.length) * 100).toFixed(1);
    console.log(`\n📊 Progress: ${processed}/${allToProcess.length} (${progress}%)`);
    console.log(`   ✅ Success: ${results.success} | ⏭️ Skipped: ${results.skipped} | ❌ Failed: ${results.failed}`);

    // Cooldown between batches
    if (i + PARALLEL_BATCH_SIZE < allToProcess.length) {
      console.log(`\n⏱️  Cooling down for ${BATCH_COOLDOWN_MS/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_COOLDOWN_MS));
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 GENERATION COMPLETE\n');
  console.log(`📊 Results:`);
  console.log(`   ✅ Generated: ${results.success}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0 && results.errors.length <= 10) {
    console.log(`\n❌ Failed components:`);
    results.errors.forEach(({ component, error }) => {
      console.log(`   - ${component}: ${error}`);
    });
  }

  console.log('='.repeat(60));
}

main().catch(console.error);
