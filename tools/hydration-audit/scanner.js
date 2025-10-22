#!/usr/bin/env node

/**
 * Hydration Audit Scanner
 * Scans codebase for common hydration mismatch patterns
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const SCAN_DIRS = ['app', 'components', 'lib'];
const IGNORE_PATTERNS = ['node_modules', '.next', 'dist', 'build', '.git'];

// Patterns that can cause hydration issues
const HYDRATION_PATTERNS = [
  {
    id: 'browser-api-window',
    pattern: /\bwindow\b/g,
    severity: 'high',
    message: 'Direct window access in render path (SSR unsafe)',
    antiPattern: true,
  },
  {
    id: 'browser-api-document',
    pattern: /\bdocument\b/g,
    severity: 'high',
    message: 'Direct document access in render path (SSR unsafe)',
    antiPattern: true,
  },
  {
    id: 'browser-api-navigator',
    pattern: /\bnavigator\b/g,
    severity: 'medium',
    message: 'Navigator API usage (SSR unsafe)',
    antiPattern: true,
  },
  {
    id: 'browser-api-localstorage',
    pattern: /\blocalStorage\b/g,
    severity: 'high',
    message: 'localStorage access (SSR unsafe)',
    antiPattern: true,
  },
  {
    id: 'date-now',
    pattern: /Date\.now\(\)|new Date\(\)/g,
    severity: 'high',
    message: 'Dynamic date/time in render (causes SSR/client mismatch)',
    antiPattern: true,
  },
  {
    id: 'math-random',
    pattern: /Math\.random\(\)/g,
    severity: 'high',
    message: 'Math.random() in render (causes SSR/client mismatch)',
    antiPattern: true,
  },
  {
    id: 'locale-string-no-args',
    pattern: /\.toLocaleString\(\s*\)/g,
    severity: 'medium',
    message: 'toLocaleString() without explicit locale (may cause mismatch)',
    antiPattern: true,
  },
  {
    id: 'use-effect-no-client',
    pattern: /useEffect/g,
    checkForClientDirective: true,
    severity: 'medium',
    message: 'useEffect without "use client" directive',
    antiPattern: true,
  },
  {
    id: 'use-state-no-client',
    pattern: /useState/g,
    checkForClientDirective: true,
    severity: 'medium',
    message: 'useState without "use client" directive',
    antiPattern: true,
  },
  {
    id: 'typeof-window-guard',
    pattern: /typeof window\s*!==?\s*['"]undefined['"]/g,
    severity: 'low',
    message: 'typeof window guard detected (heuristic, may indicate SSR issue)',
    antiPattern: false,
  },
];

class HydrationAuditor {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.results = [];
    this.stats = { files: 0, issues: 0, high: 0, medium: 0, low: 0 };
  }

  async scan() {
    console.log('🔍 Starting Hydration Audit...\n');

    for (const dir of SCAN_DIRS) {
      const fullPath = path.join(this.rootDir, dir);
      if (fs.existsSync(fullPath)) {
        await this.scanDirectory(fullPath);
      }
    }

    return this.results;
  }

  async scanDirectory(dir) {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      if (IGNORE_PATTERNS.some(p => fullPath.includes(p))) {
        continue;
      }

      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (stats.isFile() && this.shouldScanFile(entry)) {
        await this.scanFile(fullPath);
      }
    }
  }

  shouldScanFile(filename) {
    return /\.(tsx?|jsx?)$/.test(filename);
  }

  async scanFile(filePath) {
    const content = await readFile(filePath, 'utf-8');
    const relativePath = path.relative(this.rootDir, filePath);

    this.stats.files++;

    const hasClientDirective = /^['"]use client['"];?\s*$/m.test(content);
    const hasServerDirective = /^['"]use server['"];?\s*$/m.test(content);

    for (const patternDef of HYDRATION_PATTERNS) {
      const matches = Array.from(content.matchAll(patternDef.pattern));

      if (matches.length === 0) continue;

      // Skip if it's in a useEffect or other safe context
      for (const match of matches) {
        const index = match.index;
        const lineNumber = content.substring(0, index).split('\n').length;
        const line = content.split('\n')[lineNumber - 1];

        // Check context
        const inUseEffect = this.isInUseEffect(content, index);
        const inComment = this.isInComment(line, match.index);
        const inString = this.isInString(line);

        if (inComment || inString) continue;

        // Special check for hooks without "use client"
        if (patternDef.checkForClientDirective && !hasClientDirective && !hasServerDirective) {
          if (!inUseEffect) {
            this.addIssue({
              file: relativePath,
              line: lineNumber,
              column: match.index - content.lastIndexOf('\n', index) - 1,
              pattern: patternDef.id,
              severity: patternDef.severity,
              message: patternDef.message,
              snippet: line.trim(),
              fix: 'Add "use client" directive at top of file',
            });
          }
          continue;
        }

        // Browser APIs should be in useEffect or client components
        if (patternDef.antiPattern) {
          const safe = inUseEffect || hasClientDirective;

          if (!safe) {
            this.addIssue({
              file: relativePath,
              line: lineNumber,
              column: match.index - content.lastIndexOf('\n', index) - 1,
              pattern: patternDef.id,
              severity: patternDef.severity,
              message: patternDef.message,
              snippet: line.trim(),
              fix: this.suggestFix(patternDef),
            });
          }
        }
      }
    }
  }

  isInUseEffect(content, index) {
    // Check if the match is inside a useEffect callback
    const beforeMatch = content.substring(0, index);
    const useEffectStart = beforeMatch.lastIndexOf('useEffect');
    if (useEffectStart === -1) return false;

    const afterUseEffect = content.substring(useEffectStart, index);
    const openBraces = (afterUseEffect.match(/{/g) || []).length;
    const closeBraces = (afterUseEffect.match(/}/g) || []).length;

    return openBraces > closeBraces;
  }

  isInComment(line, index) {
    const beforeMatch = line.substring(0, index);
    return beforeMatch.includes('//') || beforeMatch.includes('/*');
  }

  isInString(line) {
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    return (singleQuotes % 2 !== 0) || (doubleQuotes % 2 !== 0);
  }

  suggestFix(patternDef) {
    const fixes = {
      'browser-api-window': 'Move to useEffect or add "use client" directive',
      'browser-api-document': 'Move to useEffect or add "use client" directive',
      'browser-api-navigator': 'Move to useEffect or use dynamic import with ssr:false',
      'browser-api-localstorage': 'Move to useEffect in client component',
      'date-now': 'Pass date from server props or calculate in useEffect',
      'math-random': 'Generate stable ID on server or calculate in useEffect',
      'locale-string-no-args': 'Add explicit locale: toLocaleString("nl-NL")',
    };

    return fixes[patternDef.id] || 'Review and fix hydration mismatch';
  }

  addIssue(issue) {
    this.results.push(issue);
    this.stats.issues++;
    this.stats[issue.severity]++;
  }

  generateReport(format = 'console') {
    if (format === 'console') {
      return this.generateConsoleReport();
    } else if (format === 'md') {
      return this.generateMarkdownReport();
    } else if (format === 'json') {
      return JSON.stringify({ stats: this.stats, issues: this.results }, null, 2);
    }
  }

  generateConsoleReport() {
    console.log('\n' + '═'.repeat(80));
    console.log('HYDRATION AUDIT REPORT');
    console.log('═'.repeat(80));
    console.log(`Files Scanned: ${this.stats.files}`);
    console.log(`Issues Found: ${this.stats.issues}`);
    console.log(`  🔴 High: ${this.stats.high}`);
    console.log(`  🟡 Medium: ${this.stats.medium}`);
    console.log(`  🔵 Low: ${this.stats.low}`);
    console.log('═'.repeat(80));

    if (this.results.length === 0) {
      console.log('\n✅ No hydration issues detected!');
      return;
    }

    // Group by file
    const byFile = {};
    for (const issue of this.results) {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    }

    for (const [file, issues] of Object.entries(byFile)) {
      console.log(`\n📄 ${file}`);
      console.log('─'.repeat(80));

      for (const issue of issues) {
        const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🔵';
        console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
        console.log(`     Pattern: ${issue.pattern}`);
        console.log(`     Snippet: ${issue.snippet}`);
        console.log(`     Fix: ${issue.fix}`);
        console.log('');
      }
    }

    console.log('═'.repeat(80));
    return '';
  }

  generateMarkdownReport() {
    let md = '# Hydration Audit Report\n\n';
    md += `**Generated:** ${new Date().toISOString()}\n\n`;
    md += '## Summary\n\n';
    md += `- Files Scanned: ${this.stats.files}\n`;
    md += `- Issues Found: ${this.stats.issues}\n`;
    md += `  - 🔴 High: ${this.stats.high}\n`;
    md += `  - 🟡 Medium: ${this.stats.medium}\n`;
    md += `  - 🔵 Low: ${this.stats.low}\n\n`;

    if (this.results.length === 0) {
      md += '✅ **No hydration issues detected!**\n';
      return md;
    }

    md += '## Issues by File\n\n';

    const byFile = {};
    for (const issue of this.results) {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    }

    for (const [file, issues] of Object.entries(byFile)) {
      md += `### \`${file}\`\n\n`;
      md += '| Line | Severity | Pattern | Message | Snippet | Fix |\n';
      md += '|------|----------|---------|---------|---------|-----|\n';

      for (const issue of issues) {
        const severity = issue.severity === 'high' ? '🔴 High' : issue.severity === 'medium' ? '🟡 Medium' : '🔵 Low';
        md += `| ${issue.line} | ${severity} | ${issue.pattern} | ${issue.message} | \`${issue.snippet}\` | ${issue.fix} |\n`;
      }

      md += '\n';
    }

    return md;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const rootDir = args[0] || process.cwd();
  const format = args.find(a => a.startsWith('--'))?.replace('--', '') || 'console';

  const auditor = new HydrationAuditor(rootDir);
  await auditor.scan();
  const report = auditor.generateReport(format);

  if (format === 'md' || format === 'json') {
    console.log(report);
  }

  // Exit with error if high-severity issues found
  if (auditor.stats.high > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { HydrationAuditor };
