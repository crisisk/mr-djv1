#!/usr/bin/env node

/**
 * Diagnose Console Errors on Live Site
 *
 * Captures all browser console errors, warnings, and network failures
 * to understand why user sees static HTML despite Next.js serving correctly.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mr-dj.sevensa.nl';
const LOG_FILE = '/srv/apps/mr-djv1/console-errors-report.txt';

async function diagnoseConsoleErrors() {
  console.log('🔍 Starting Console Error Diagnosis...\n');
  console.log(`Target URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Capture all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // Capture network failures
  const networkFailures = [];
  page.on('requestfailed', request => {
    networkFailures.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });

  // Capture response errors
  const responseErrors = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      responseErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  console.log('━'.repeat(80));
  console.log('LOADING PAGE AND CAPTURING ERRORS');
  console.log('━'.repeat(80));

  try {
    const response = await page.goto(BASE_URL, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log(`✅ Page loaded: HTTP ${response.status()}\n`);

    // Wait a bit for any lazy-loaded scripts
    await page.waitForTimeout(3000);

    // Check what's actually in the DOM
    const domAnalysis = await page.evaluate(() => {
      return {
        hasNextRoot: document.querySelector('#__next') !== null,
        hasNextScripts: Array.from(document.querySelectorAll('script'))
          .filter(s => s.src.includes('/_next/')).length,
        hasReactRoot: document.querySelector('[data-reactroot]') !== null,
        totalScripts: document.querySelectorAll('script').length,
        title: document.title,
        bodyClasses: document.body.className,
        htmlContent: document.documentElement.outerHTML.substring(0, 2000)
      };
    });

    // Build report
    let report = '';

    report += '═'.repeat(80) + '\n';
    report += 'CONSOLE ERROR DIAGNOSIS REPORT\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `URL: ${BASE_URL}\n`;
    report += '═'.repeat(80) + '\n\n';

    // DOM Analysis
    report += '1. DOM ANALYSIS\n';
    report += '━'.repeat(80) + '\n';
    report += `Next.js #__next root: ${domAnalysis.hasNextRoot ? '✅ FOUND' : '❌ MISSING'}\n`;
    report += `Next.js scripts (_next/): ${domAnalysis.hasNextScripts} scripts\n`;
    report += `React root element: ${domAnalysis.hasReactRoot ? '✅ FOUND' : '❌ MISSING'}\n`;
    report += `Total scripts: ${domAnalysis.totalScripts}\n`;
    report += `Page title: ${domAnalysis.title}\n`;
    report += `Body classes: ${domAnalysis.bodyClasses}\n`;
    report += '\n';

    // Console Errors
    report += '2. CONSOLE ERRORS\n';
    report += '━'.repeat(80) + '\n';
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length === 0) {
      report += '✅ No console errors detected\n';
    } else {
      report += `❌ Found ${errors.length} console error(s):\n\n`;
      errors.forEach((error, i) => {
        report += `Error ${i + 1}:\n`;
        report += `  Message: ${error.text}\n`;
        if (error.location.url) {
          report += `  Location: ${error.location.url}:${error.location.lineNumber}:${error.location.columnNumber}\n`;
        }
        report += '\n';
      });
    }

    // Console Warnings
    report += '3. CONSOLE WARNINGS\n';
    report += '━'.repeat(80) + '\n';
    const warnings = consoleLogs.filter(log => log.type === 'warning');
    if (warnings.length === 0) {
      report += '✅ No console warnings detected\n';
    } else {
      report += `⚠️  Found ${warnings.length} console warning(s):\n\n`;
      warnings.forEach((warning, i) => {
        report += `Warning ${i + 1}: ${warning.text}\n`;
      });
    }
    report += '\n';

    // Page Errors (JavaScript exceptions)
    report += '4. JAVASCRIPT EXCEPTIONS\n';
    report += '━'.repeat(80) + '\n';
    if (pageErrors.length === 0) {
      report += '✅ No JavaScript exceptions detected\n';
    } else {
      report += `❌ Found ${pageErrors.length} JavaScript exception(s):\n\n`;
      pageErrors.forEach((error, i) => {
        report += `Exception ${i + 1}:\n`;
        report += `  Message: ${error.message}\n`;
        if (error.stack) {
          report += `  Stack:\n${error.stack.split('\n').map(line => '    ' + line).join('\n')}\n`;
        }
        report += '\n';
      });
    }

    // Network Failures
    report += '5. NETWORK FAILURES\n';
    report += '━'.repeat(80) + '\n';
    if (networkFailures.length === 0) {
      report += '✅ No network failures detected\n';
    } else {
      report += `❌ Found ${networkFailures.length} network failure(s):\n\n`;
      networkFailures.forEach((failure, i) => {
        report += `Failure ${i + 1}:\n`;
        report += `  URL: ${failure.url}\n`;
        report += `  Method: ${failure.method}\n`;
        report += `  Error: ${failure.failure}\n`;
        report += '\n';
      });
    }

    // HTTP Errors (4xx, 5xx)
    report += '6. HTTP ERRORS\n';
    report += '━'.repeat(80) + '\n';
    if (responseErrors.length === 0) {
      report += '✅ No HTTP errors detected\n';
    } else {
      report += `❌ Found ${responseErrors.length} HTTP error(s):\n\n`;
      responseErrors.forEach((error, i) => {
        report += `Error ${i + 1}:\n`;
        report += `  URL: ${error.url}\n`;
        report += `  Status: ${error.status} ${error.statusText}\n`;
        report += '\n';
      });
    }

    // All Console Logs (for reference)
    report += '7. ALL CONSOLE LOGS (FULL TRANSCRIPT)\n';
    report += '━'.repeat(80) + '\n';
    if (consoleLogs.length === 0) {
      report += 'No console logs captured\n';
    } else {
      report += `Total logs: ${consoleLogs.length}\n\n`;
      consoleLogs.forEach((log, i) => {
        report += `[${log.type.toUpperCase()}] ${log.text}\n`;
      });
    }
    report += '\n';

    // HTML Sample
    report += '8. HTML SAMPLE (First 2000 chars)\n';
    report += '━'.repeat(80) + '\n';
    report += domAnalysis.htmlContent + '\n...\n\n';

    // Diagnosis
    report += '9. DIAGNOSIS\n';
    report += '━'.repeat(80) + '\n';

    if (errors.length > 0 || pageErrors.length > 0) {
      report += '❌ ISSUE FOUND: JavaScript errors are preventing Next.js from hydrating\n';
      report += 'These errors are blocking React from taking over the static HTML.\n\n';
      report += 'RECOMMENDATION:\n';
      report += '- Fix all JavaScript errors listed above\n';
      report += '- Check if _next/ scripts are accessible (not 404)\n';
      report += '- Verify all dependencies are bundled correctly\n';
    } else if (networkFailures.length > 0) {
      report += '❌ ISSUE FOUND: Network failures preventing resources from loading\n';
      report += 'Next.js scripts are failing to load due to network errors.\n\n';
      report += 'RECOMMENDATION:\n';
      report += '- Check Traefik routing for /_next/ paths\n';
      report += '- Verify all static assets are accessible\n';
      report += '- Check CORS configuration\n';
    } else if (responseErrors.length > 0) {
      report += '❌ ISSUE FOUND: HTTP errors for some resources\n';
      report += 'Some resources are returning 4xx/5xx errors.\n\n';
      report += 'RECOMMENDATION:\n';
      report += '- Check which resources are failing\n';
      report += '- Verify paths in Next.js build output\n';
      report += '- Check Traefik routing rules\n';
    } else if (domAnalysis.hasNextScripts === 0) {
      report += '❌ ISSUE FOUND: No Next.js scripts found in HTML\n';
      report += 'The HTML does not contain any _next/ script tags.\n\n';
      report += 'RECOMMENDATION:\n';
      report += '- This suggests static HTML export instead of Next.js server\n';
      report += '- Verify the container is running Next.js (not nginx)\n';
      report += '- Check docker-compose.yml configuration\n';
    } else {
      report += '✅ No obvious issues detected in console or network\n';
      report += 'Next.js scripts are present and no errors reported.\n\n';
      report += 'POSSIBLE CAUSES:\n';
      report += '- Browser caching (hard refresh needed: Ctrl+Shift+R)\n';
      report += '- Service worker caching previous version\n';
      report += '- CDN/proxy caching old version\n';
      report += '- User might be viewing a different domain/port\n';
    }

    report += '\n';
    report += '═'.repeat(80) + '\n';
    report += 'END OF REPORT\n';
    report += '═'.repeat(80) + '\n';

    // Write report
    fs.writeFileSync(LOG_FILE, report);
    console.log(report);

    console.log(`\n📁 Full report saved to: ${LOG_FILE}\n`);

    // Summary
    console.log('═'.repeat(80));
    console.log('SUMMARY');
    console.log('═'.repeat(80));
    console.log(`Console Errors: ${errors.length}`);
    console.log(`Console Warnings: ${warnings.length}`);
    console.log(`JavaScript Exceptions: ${pageErrors.length}`);
    console.log(`Network Failures: ${networkFailures.length}`);
    console.log(`HTTP Errors: ${responseErrors.length}`);
    console.log(`Next.js Scripts: ${domAnalysis.hasNextScripts}`);
    console.log('═'.repeat(80));

    if (errors.length > 0 || pageErrors.length > 0 || networkFailures.length > 0) {
      console.log('\n⚠️  ISSUES DETECTED - See report above for details');
      process.exit(1);
    } else {
      console.log('\n✅ No critical issues detected');
      process.exit(0);
    }

  } catch (error) {
    console.error(`❌ Failed to load page: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

diagnoseConsoleErrors().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
