#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const REPLICATE_API_KEY = 'r8_SYVAt2n0lxjFOb2ACWpltmFt4KddG7i2ZTKaM';
const OPENROUTER_API_KEY = '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';

const EDS_COMPONENTS_DIR = '/srv/apps/mr-djv1/mr-dj-eds-components/src/components';
const OUTPUT_DIR = '/srv/apps/mr-djv1/dynamic-api/components';
const EXISTING_COMPONENTS_DIR = '/srv/apps/mr-djv1/dynamic-api/components';

// Best models from each service
const MODELS = {
  replicate: [
    'meta/llama-2-70b-chat',
    'mistralai/mixtral-8x7b-instruct-v0.1',
  ],
  openrouter: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4-turbo-preview',
    'google/gemini-pro-1.5',
  ]
};

// Get all EDS component files
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
        const componentName = path.basename(item, '.jsx');
        components.push({
          name: componentName,
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

// Get already implemented components
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
        const componentName = path.basename(item, '.tsx');
        implemented.add(componentName.toLowerCase());
      }
    }
  }

  scanDirectory(EXISTING_COMPONENTS_DIR);
  return implemented;
}

// Call OpenRouter API
async function callOpenRouter(prompt, model) {
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
          content: `You are an expert React/Next.js developer specializing in converting JSX components to TypeScript TSX with proper types, Next.js 14 App Router compatibility, design token integration, and accessibility features.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Call Replicate API
async function callReplicate(prompt, model) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      input: {
        prompt: prompt,
        max_length: 4000,
        temperature: 0.3,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replicate API error: ${response.status} - ${error}`);
  }

  const prediction = await response.json();

  // Poll for completion
  let result = prediction;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pollResponse = await fetch(result.urls.get, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
      }
    });
    result = await pollResponse.json();
  }

  if (result.status === 'failed') {
    throw new Error('Replicate prediction failed');
  }

  return result.output.join('');
}

// Generate component conversion prompt
function generatePrompt(componentName, sourceCode, category) {
  return `Convert this React JSX component to TypeScript TSX for Next.js 14 App Router with the following requirements:

COMPONENT TO CONVERT:
Name: ${componentName}
Category: ${category}
Source Code:
\`\`\`jsx
${sourceCode}
\`\`\`

REQUIREMENTS:
1. Convert to TypeScript with proper type definitions (interfaces for props, state, etc.)
2. Use 'use client' directive at the top if component has interactivity (useState, useEffect, event handlers)
3. Replace all hardcoded colors with design tokens:
   - Primary: var(--color-primary-blue) or text-primary/bg-primary
   - Secondary: var(--color-secondary-gold) or text-secondary/bg-secondary
   - Neutral: var(--color-neutral-dark) or text-neutral-dark
4. Replace all spacing with design token classes:
   - spacing-xs (4px), spacing-sm (8px), spacing-md (16px), spacing-lg (24px), spacing-xl (32px), spacing-2xl (48px), spacing-3xl (64px)
5. Use Framer Motion for animations where appropriate (import from 'framer-motion')
6. Ensure WCAG AA accessibility:
   - Proper ARIA labels
   - Keyboard navigation support
   - Focus states
   - Semantic HTML
7. Use Next.js Image component for images (from 'next/image')
8. Add JSDoc comments for exported components
9. Export as default export
10. Optimize for performance (React.memo where appropriate, useMemo for expensive calculations)

OUTPUT FORMAT:
Return ONLY the TypeScript code, no explanations. Start with 'use client' if needed, then the full component code.`;
}

// Process a single component
async function processComponent(component, useReplicate = false) {
  try {
    console.log(`\n🔄 Processing: ${component.name} (${component.category})`);

    // Check if already implemented
    const implemented = getImplementedComponents();
    if (implemented.has(component.name.toLowerCase())) {
      console.log(`✅ Already implemented: ${component.name}`);
      return { success: true, skipped: true };
    }

    // Read source code
    const sourceCode = fs.readFileSync(component.path, 'utf-8');

    // Generate prompt
    const prompt = generatePrompt(component.name, sourceCode, component.category);

    // Call AI API
    let generatedCode;
    try {
      if (useReplicate) {
        console.log('   Using Replicate API...');
        generatedCode = await callReplicate(prompt, MODELS.replicate[0]);
      } else {
        console.log('   Using OpenRouter API (Claude 3.5 Sonnet)...');
        generatedCode = await callOpenRouter(prompt, MODELS.openrouter[0]);
      }
    } catch (apiError) {
      console.error(`   API Error: ${apiError.message}`);
      // Fallback to other service
      if (useReplicate) {
        console.log('   Falling back to OpenRouter...');
        generatedCode = await callOpenRouter(prompt, MODELS.openrouter[0]);
      } else {
        console.log('   Falling back to Replicate...');
        generatedCode = await callReplicate(prompt, MODELS.replicate[0]);
      }
    }

    // Extract code from markdown if wrapped
    if (generatedCode.includes('```')) {
      const match = generatedCode.match(/```(?:tsx|typescript)?\n([\s\S]*?)```/);
      if (match) {
        generatedCode = match[1];
      }
    }

    // Determine output path based on category
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

    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write generated code
    fs.writeFileSync(outputPath, generatedCode, 'utf-8');

    console.log(`✅ Generated: ${outputPath}`);
    return { success: true, path: outputPath };

  } catch (error) {
    console.error(`❌ Failed to process ${component.name}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting AI Component Generation...\n');
  console.log('📊 Configuration:');
  console.log(`   - Replicate API: ${REPLICATE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   - OpenRouter API: ${OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   - Source: ${EDS_COMPONENTS_DIR}`);
  console.log(`   - Output: ${OUTPUT_DIR}`);

  // Get all components
  const allComponents = getAllEDSComponents();
  console.log(`\n📦 Found ${allComponents.length} EDS components`);

  // Get already implemented
  const implemented = getImplementedComponents();
  console.log(`✅ Already implemented: ${implemented.size} components`);

  const toGenerate = allComponents.filter(c => !implemented.has(c.name.toLowerCase()));
  console.log(`🎯 To generate: ${toGenerate.length} components\n`);

  // Priority components (process these first)
  const priority = [
    'OptimizedVideo', 'StatHighlights', 'Forms', 'Navigation',
    'PersonaMatchShowcase', 'ContentHubShowcase', 'ServicePage',
    'ErrorPages', 'progress', 'checkbox', 'radio-group', 'select', 'input', 'textarea',
    'command', 'popover', 'sheet', 'table', 'chart',
    'badge', 'avatar', 'skeleton', 'alert',
  ];

  const priorityComponents = toGenerate.filter(c =>
    priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );
  const otherComponents = toGenerate.filter(c =>
    !priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );

  console.log(`🔥 Priority components: ${priorityComponents.length}`);
  console.log(`📋 Other components: ${otherComponents.length}\n`);

  // Process components
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  // Process priority components first (in parallel batches of 5)
  const batchSize = 5;
  const allToProcess = [...priorityComponents, ...otherComponents];

  for (let i = 0; i < allToProcess.length; i += batchSize) {
    const batch = allToProcess.slice(i, i + batchSize);
    console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allToProcess.length / batchSize)}...`);

    const batchPromises = batch.map((component, idx) =>
      processComponent(component, idx % 2 === 0) // Alternate between APIs
    );

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach((result, idx) => {
      if (result.skipped) {
        results.skipped++;
      } else if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          component: batch[idx].name,
          error: result.error
        });
      }
    });

    // Progress update
    const processed = Math.min(i + batchSize, allToProcess.length);
    const progress = ((processed / allToProcess.length) * 100).toFixed(1);
    console.log(`\n📊 Progress: ${processed}/${allToProcess.length} (${progress}%)`);
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 GENERATION COMPLETE\n');
  console.log(`📊 Final Results:`);
  console.log(`   ✅ Successfully generated: ${results.success}`);
  console.log(`   ⏭️  Skipped (already exist): ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📦 Total processed: ${allToProcess.length}`);

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors:`);
    results.errors.forEach(({ component, error }) => {
      console.log(`   - ${component}: ${error}`);
    });
  }

  console.log('='.repeat(60));
}

// Run
main().catch(console.error);
