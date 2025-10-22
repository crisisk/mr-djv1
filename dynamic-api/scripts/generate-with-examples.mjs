#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_KEY = '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';
const EDS_COMPONENTS_DIR = '/srv/apps/mr-djv1/mr-dj-eds-components/src/components';
const OUTPUT_DIR = '/srv/apps/mr-djv1/dynamic-api/components';
const PROJECT_DIR = '/srv/apps/mr-djv1/dynamic-api';

// Parallel processing with stricter rate limits
const PARALLEL_BATCH_SIZE = 3;  // Reduced to 3 for better quality
const BATCH_COOLDOWN_MS = 20000; // Increased to 20s
const REQUEST_DELAY_MS = 3000;   // Increased to 3s

const MODELS = {
  openrouter: [
    'anthropic/claude-sonnet-4.5',
    'openai/gpt-4',
  ]
};

// Working example for the prompt
const WORKING_EXAMPLE = `
EXAMPLE OF CORRECT OUTPUT:

'use client';

import React, { useRef, useState } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  preload?: 'metadata' | 'none' | 'auto';
  onPlay?: () => void;
  onEnded?: () => void;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  className = '',
  preload = 'metadata',
  onPlay,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };

  return (
    <div className={\`relative \${className}\`}>
      <video
        ref={videoRef}
        className="w-full h-full rounded-2xl shadow-xl"
        poster={poster}
        autoPlay={autoPlay}
        muted={autoPlay ? true : muted}
        loop={loop}
        controls={controls}
        playsInline
        preload={preload}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser doesn&apos;t support video playback.
      </video>
    </div>
  );
};

export default OptimizedVideo;

KEY POINTS FROM EXAMPLE:
- Starts with 'use client' (has hooks)
- Proper TypeScript interfaces
- React.FC with typed props
- Default prop values in destructuring
- Tailwind classes with design tokens
- MUST end with "export default ComponentName;"
- NO imports to SlideLayout or non-existent components
- Use &apos; for apostrophes in JSX
`;

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
          relativePath,
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

async function callOpenRouter(prompt, model, componentIndex) {
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
          content: `You are an expert React/Next.js developer. You MUST output ONLY valid TypeScript code.
NO markdown, NO explanations, NO code blocks with \`\`\`.
Output must start with either 'use client'; or import statements and end with export default ComponentName;`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,  // Lower for more consistent output
      max_tokens: 6000,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateEnhancedPrompt(componentName, sourceCode) {
  // Truncate source for prompt size
  const truncatedSource = sourceCode.slice(0, 2500);

  return `Convert this JSX component to TypeScript following the EXACT pattern shown below.

${WORKING_EXAMPLE}

NOW CONVERT THIS COMPONENT:

Component Name: ${componentName}

Source JSX:
${truncatedSource}

CRITICAL REQUIREMENTS:
1. Output MUST be valid TypeScript code ONLY
2. NO markdown code blocks (\`\`\`)
3. NO explanations before or after code
4. Start with 'use client'; if component uses: useState, useEffect, onClick, onChange, or any hooks
5. Create proper TypeScript interface for props
6. Use React.FC<PropsInterface> type
7. Button component ONLY accepts: variant="primary"|"secondary"|"ghost" and size="sm"|"md"|"lg"
8. Use design token classes: text-primary, bg-primary, spacing-xs/sm/md/lg/xl, rounded-2xl
9. REMOVE any imports to SlideLayout - this component doesn't exist
10. Use relative imports: '../ui/ComponentName' not absolute paths
11. MUST end with: export default ${componentName};
12. Use &apos; for apostrophes in JSX strings

OUTPUT THE TYPESCRIPT CODE NOW (no markdown, just raw TypeScript):`;
}

function cleanGeneratedCode(code, componentName) {
  let cleaned = code.trim();

  // Remove markdown blocks
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:tsx|typescript|ts|jsx)?\s*\n([\s\S]*?)```/);
    if (match) cleaned = match[1].trim();
  }

  // Remove any leading explanatory text before imports/'use client'
  const lines = cleaned.split('\n');
  let startIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') ||
        line.startsWith("'use client'") ||
        line.startsWith('"use client"') ||
        line.startsWith('export ') ||
        line.startsWith('interface ') ||
        line.startsWith('type ')) {
      startIndex = i;
      break;
    }
  }

  cleaned = lines.slice(startIndex).join('\n');

  // Ensure it ends with export default
  if (!cleaned.includes('export default')) {
    cleaned += `\n\nexport default ${componentName};`;
  }

  // Validation
  const issues = [];
  if (cleaned.includes('variant="outline"')) issues.push('Invalid Button variant');
  if (cleaned.includes('size="icon"')) issues.push('Invalid Button size');
  if (cleaned.includes('SlideLayout')) issues.push('SlideLayout reference');
  if (!cleaned.includes(`export default ${componentName}`)) {
    issues.push(`Missing "export default ${componentName}"`);
  }

  if (issues.length > 0) {
    throw new Error(`Validation: ${issues.join(', ')}`);
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
    return {
      success: false,
      error: error.stderr || error.message
    };
  }
}

async function processComponent(component, batchIndex) {
  const maxAttempts = 2;  // Reduced attempts, rely on better prompts

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`  [${component.name}] Attempt ${attempt}/${maxAttempts}`);

      const implemented = getImplementedComponents();
      if (implemented.has(component.name.toLowerCase())) {
        console.log(`  [${component.name}] ✅ Exists`);
        return { success: true, skipped: true };
      }

      const sourceCode = fs.readFileSync(component.path, 'utf-8');
      const prompt = generateEnhancedPrompt(component.name, sourceCode);

      const modelIndex = (attempt - 1) % MODELS.openrouter.length;
      const model = MODELS.openrouter[modelIndex];

      let generatedCode = await callOpenRouter(prompt, model, batchIndex);

      try {
        generatedCode = cleanGeneratedCode(generatedCode, component.name);
      } catch (cleanError) {
        console.log(`  [${component.name}] ⚠️ ${cleanError.message}`);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
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

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, generatedCode, 'utf-8');

      // Verify TypeScript
      const verification = await verifyTypeScript(outputPath);
      if (!verification.success) {
        console.log(`  [${component.name}] ⚠️ TypeScript error`);
        if (attempt < maxAttempts) {
          fs.unlinkSync(outputPath);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
        // Keep file even if TS error for manual review
      }

      console.log(`  [${component.name}] ✅ Generated${!verification.success ? ' (with TS warnings)' : ''}`);
      return { success: true, path: outputPath, hasWarnings: !verification.success };

    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(`  [${component.name}] ❌ ${error.message.slice(0, 80)}`);
        return { success: false, error: error.message };
      }
    }
  }

  return { success: false, error: 'Max attempts exceeded' };
}

async function main() {
  console.log('🚀 Enhanced Component Generation with Examples\n');
  console.log(`⚙️  Config: ${PARALLEL_BATCH_SIZE} per batch, ${BATCH_COOLDOWN_MS}ms cooldown\n`);

  const allComponents = getAllEDSComponents();
  const implemented = getImplementedComponents();
  const toGenerate = allComponents.filter(c => !implemented.has(c.name.toLowerCase()));

  console.log(`📦 Total: ${allComponents.length} | ✅ Done: ${implemented.size} | 🎯 Todo: ${toGenerate.length}\n`);

  if (toGenerate.length === 0) {
    console.log('✨ All done!');
    return;
  }

  // Prioritize simpler UI components first
  const priority = ['badge', 'avatar', 'skeleton', 'alert', 'progress',
                    'checkbox', 'radio-group', 'select', 'input', 'textarea'];

  const priorityComponents = toGenerate.filter(c =>
    priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );
  const otherComponents = toGenerate.filter(c =>
    !priority.some(p => c.name.toLowerCase().includes(p.toLowerCase()))
  );

  const allToProcess = [...priorityComponents, ...otherComponents];
  const results = { success: 0, failed: 0, skipped: 0, warnings: 0, errors: [] };

  for (let i = 0; i < allToProcess.length; i += PARALLEL_BATCH_SIZE) {
    const batch = allToProcess.slice(i, i + PARALLEL_BATCH_SIZE);
    const batchNum = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allToProcess.length / PARALLEL_BATCH_SIZE);

    console.log(`\n🔄 Batch ${batchNum}/${totalBatches}: ${batch.map(c => c.name).join(', ')}`);

    const batchPromises = batch.map((component, idx) =>
      processComponent(component, idx)
    );

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach((result) => {
      if (result.skipped) {
        results.skipped++;
      } else if (result.success) {
        results.success++;
        if (result.hasWarnings) results.warnings++;
      } else {
        results.failed++;
        if (results.errors.length < 10) {
          results.errors.push(result.error);
        }
      }
    });

    const processed = Math.min(i + PARALLEL_BATCH_SIZE, allToProcess.length);
    const progress = ((processed / allToProcess.length) * 100).toFixed(1);
    console.log(`\n📊 ${processed}/${allToProcess.length} (${progress}%) | ✅ ${results.success} | ⚠️  ${results.warnings} | ❌ ${results.failed}`);

    if (i + PARALLEL_BATCH_SIZE < allToProcess.length) {
      console.log(`⏱️  Cooling ${BATCH_COOLDOWN_MS/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_COOLDOWN_MS));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE\n');
  console.log(`✅ Success: ${results.success} (${results.warnings} with warnings)`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);

  if (results.errors.length > 0) {
    console.log(`\n❌ Sample errors:`);
    results.errors.slice(0, 5).forEach(error => {
      console.log(`   - ${error.slice(0, 100)}`);
    });
  }

  console.log('='.repeat(60));
}

main().catch(console.error);
