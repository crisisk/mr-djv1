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

// Available Button variants from our codebase
const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'];
const BUTTON_SIZES = ['sm', 'md', 'lg'];

// Best models that are actually working
const MODELS = {
  openrouter: [
    'anthropic/claude-sonnet-4.5',  // Claude Sonnet 4.5
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

  scanDirectory(OUTPUT_DIR);
  return implemented;
}

// Improved OpenRouter API call with better error handling
async function callOpenRouter(prompt, model, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
              content: `You are an expert React/Next.js developer. You MUST return ONLY valid TypeScript code without any markdown formatting, explanations, or code blocks. Do not wrap the code in \`\`\`typescript or any other markdown syntax. Return raw TypeScript code only.`
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
      return data.choices[0].message.content;
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`   Retry ${attempt + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}

// Enhanced prompt with explicit formatting instructions
function generateImprovedPrompt(componentName, sourceCode, category) {
  return `Convert the following React JSX component to TypeScript TSX for Next.js 14 App Router.

IMPORTANT FORMATTING RULES:
- Return ONLY the TypeScript code
- Do NOT wrap in markdown code blocks
- Do NOT include \`\`\`typescript or \`\`\`tsx
- Do NOT add explanations before or after the code
- Start directly with 'use client' (if needed) or import statements

COMPONENT INFO:
Name: ${componentName}
Category: ${category}

SOURCE CODE:
${sourceCode}

CONVERSION REQUIREMENTS:

1. TypeScript:
   - Add proper type definitions (interfaces for props)
   - Use React.FC or explicit function types
   - Add JSDoc comments for exported components

2. Client/Server:
   - Add 'use client' ONLY if component uses: useState, useEffect, event handlers, browser APIs
   - Remove if component is purely presentational

3. Design Tokens (CRITICAL):
   - Replace hardcoded colors with design token classes:
     * Primary: text-primary, bg-primary, border-primary
     * Secondary: text-secondary, bg-secondary
     * Neutral: text-neutral-dark, bg-gray-50, border-gray-200
   - Replace spacing with design token classes:
     * spacing-xs (4px), spacing-sm (8px), spacing-md (16px)
     * spacing-lg (24px), spacing-xl (32px), spacing-2xl (48px)

4. Button Component Fix:
   - ONLY use these Button variants: ${BUTTON_VARIANTS.join(', ')}
   - ONLY use these Button sizes: ${BUTTON_SIZES.join(', ')}
   - Replace "outline" with "secondary"
   - Replace "icon" size with "sm" and add "aspect-square px-2" className

5. Imports:
   - Use relative imports: '../ui/Button', '../atoms/OptimizedVideo'
   - Import from 'next/image' for images
   - Import from 'framer-motion' for animations (optional)
   - Remove any imports to SlideLayout or non-existent components

6. Accessibility:
   - Add proper ARIA labels
   - Support keyboard navigation
   - Add focus states with focus:ring-2 focus:ring-primary

7. Styling:
   - Use Tailwind utility classes
   - Use rounded-2xl or rounded-3xl for border radius
   - Use shadow-lg or shadow-xl for shadows

Return the complete, production-ready TypeScript component code now:`;
}

// Clean and validate generated code
function cleanGeneratedCode(code) {
  let cleaned = code.trim();

  // Remove markdown code blocks if present
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:tsx|typescript|ts|jsx|javascript|js)?\n([\s\S]*?)```/);
    if (match) {
      cleaned = match[1].trim();
    }
  }

  // Remove any leading/trailing explanatory text
  const lines = cleaned.split('\n');
  let startIndex = 0;
  let endIndex = lines.length;

  // Find first line that looks like code
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith("'use client'") || line.startsWith('"use client"') || line.startsWith('export ')) {
      startIndex = i;
      break;
    }
  }

  // Find last line that looks like code
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line === '}' || line === '};' || line.startsWith('export default')) {
      endIndex = i + 1;
      break;
    }
  }

  cleaned = lines.slice(startIndex, endIndex).join('\n');

  // Validate code structure
  if (!cleaned.includes('export default')) {
    throw new Error('Generated code does not include default export');
  }

  // Check for common issues
  const issues = [];
  if (cleaned.includes('variant="outline"')) {
    issues.push('Contains invalid Button variant "outline"');
  }
  if (cleaned.includes('size="icon"')) {
    issues.push('Contains invalid Button size "icon"');
  }
  if (cleaned.includes('SlideLayout')) {
    issues.push('Contains reference to non-existent SlideLayout component');
  }

  if (issues.length > 0) {
    throw new Error(`Code validation failed: ${issues.join(', ')}`);
  }

  return cleaned;
}

// Verify TypeScript compilation
async function verifyTypeScript(filePath) {
  try {
    const { stdout, stderr } = await execAsync(
      `npx tsc --noEmit --jsx react-jsx "${filePath}"`,
      { cwd: PROJECT_DIR, timeout: 30000 }
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

// Process a single component with improved error handling
async function processComponent(component) {
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`\n🔄 Processing: ${component.name} (${component.category}) [Attempt ${attempt}/${maxAttempts}]`);

      // Check if already implemented
      const implemented = getImplementedComponents();
      if (implemented.has(component.name.toLowerCase())) {
        console.log(`✅ Already implemented: ${component.name}`);
        return { success: true, skipped: true };
      }

      // Read source code
      const sourceCode = fs.readFileSync(component.path, 'utf-8');

      // Generate prompt
      const prompt = generateImprovedPrompt(component.name, sourceCode, component.category);

      // Call AI API (rotate through models)
      const modelIndex = (attempt - 1) % MODELS.openrouter.length;
      const model = MODELS.openrouter[modelIndex];
      console.log(`   Using model: ${model}`);

      let generatedCode = await callOpenRouter(prompt, model);

      // Clean and validate
      try {
        generatedCode = cleanGeneratedCode(generatedCode);
      } catch (cleanError) {
        console.log(`   ⚠️  Code cleaning failed: ${cleanError.message}`);
        if (attempt < maxAttempts) continue;
        throw cleanError;
      }

      // Determine output path
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

      // Create directory
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write generated code
      fs.writeFileSync(outputPath, generatedCode, 'utf-8');

      // Verify TypeScript compilation
      console.log(`   Verifying TypeScript...`);
      const verification = await verifyTypeScript(outputPath);

      if (!verification.success) {
        console.log(`   ⚠️  TypeScript compilation failed`);
        if (verification.stderr) {
          console.log(`   ${verification.stderr.split('\n').slice(0, 3).join('\n')}`);
        }

        if (attempt < maxAttempts) {
          fs.unlinkSync(outputPath);  // Remove bad file
          continue;
        }

        throw new Error(`TypeScript compilation failed after ${maxAttempts} attempts`);
      }

      console.log(`✅ Generated: ${outputPath}`);
      return { success: true, path: outputPath };

    } catch (error) {
      lastError = error;
      console.error(`   ❌ Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  return { success: false, error: lastError?.message || 'Unknown error' };
}

// Main execution
async function main() {
  console.log('🚀 Starting Improved AI Component Generation...\n');
  console.log('📊 Configuration:');
  console.log(`   - OpenRouter API: ${OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   - Source: ${EDS_COMPONENTS_DIR}`);
  console.log(`   - Output: ${OUTPUT_DIR}`);
  console.log(`   - TypeScript Validation: ✅ Enabled`);

  const allComponents = getAllEDSComponents();
  console.log(`\n📦 Found ${allComponents.length} EDS components`);

  const implemented = getImplementedComponents();
  console.log(`✅ Already implemented: ${implemented.size} components`);

  const toGenerate = allComponents.filter(c => !implemented.has(c.name.toLowerCase()));
  console.log(`🎯 To generate: ${toGenerate.length} components\n`);

  if (toGenerate.length === 0) {
    console.log('✨ All components are already implemented!');
    return;
  }

  // Priority components
  const priority = [
    'badge', 'avatar', 'skeleton', 'alert', 'alert-dialog',
    'progress', 'checkbox', 'radio-group', 'select', 'input', 'textarea',
    'command', 'popover', 'sheet', 'table', 'chart',
    'PricingTables', 'ServicePage', 'ErrorPages'
  ];

  const priorityComponents = toGenerate.filter(c =>
    priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );
  const otherComponents = toGenerate.filter(c =>
    !priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );

  console.log(`🔥 Priority components: ${priorityComponents.length}`);
  console.log(`📋 Other components: ${otherComponents.length}\n`);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  // Process components sequentially to avoid rate limits
  const allToProcess = [...priorityComponents, ...otherComponents];

  for (let i = 0; i < allToProcess.length; i++) {
    const component = allToProcess[i];
    const result = await processComponent(component);

    if (result.skipped) {
      results.skipped++;
    } else if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({
        component: component.name,
        error: result.error
      });
    }

    // Progress update
    const progress = (((i + 1) / allToProcess.length) * 100).toFixed(1);
    console.log(`\n📊 Progress: ${i + 1}/${allToProcess.length} (${progress}%)`);
    console.log(`   ✅ Success: ${results.success}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);

    // Rate limiting
    if ((i + 1) % 5 === 0 && i < allToProcess.length - 1) {
      console.log('\n⏱️  Cooling down to avoid rate limits...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
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
