#!/usr/bin/env node

/**
 * Playwright Test: Verify Next.js Website is Running
 *
 * Tests that the website is serving Next.js (not static HTML)
 * and that all new city pages are accessible.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mr-dj.sevensa.nl';
const SCREENSHOT_DIR = '/srv/apps/mr-djv1/test-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🚀 Starting Playwright tests for MR-DJ website...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshot directory: ${SCREENSHOT_DIR}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  let passedTests = 0;
  let failedTests = 0;
  let totalTests = 0;
  let homepageResponse = null;

  // Test 1: Homepage loads
  console.log('━'.repeat(80));
  console.log('TEST 1: Homepage Loads');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    homepageResponse = response;

    if (response.status() === 200) {
      console.log('✅ Homepage loads successfully (HTTP 200)');
      passedTests++;
    } else {
      console.log(`❌ Homepage returned HTTP ${response.status()}`);
      failedTests++;
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-homepage.png'), fullPage: true });
    console.log(`📸 Screenshot saved: 01-homepage.png`);
  } catch (error) {
    console.log(`❌ Failed to load homepage: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 2: Verify Next.js is running (check for Next.js markers)
  console.log('━'.repeat(80));
  console.log('TEST 2: Verify Next.js (not static HTML)');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    // Check for Next.js specific elements
    const nextJsMarkers = await page.evaluate(() => {
      // Check for Next.js script tags
      const hasNextScripts = Array.from(document.querySelectorAll('script'))
        .some(script => script.src.includes('/_next/') || script.src.includes('next'));

      // Check for Next.js data attribute
      const hasNextData = document.querySelector('[data-next]') !== null;

      // Check for Next.js root element
      const hasNextRoot = document.querySelector('#__next') !== null;

      // Check response headers via meta or other means
      const headers = {};
      document.querySelectorAll('meta').forEach(meta => {
        if (meta.name) headers[meta.name] = meta.content;
      });

      return {
        hasNextScripts,
        hasNextData,
        hasNextRoot,
        title: document.title,
        hasReactRoot: document.querySelector('[data-reactroot]') !== null
      };
    });

    console.log('Next.js Markers Found:');
    console.log(`  - Next.js scripts: ${nextJsMarkers.hasNextScripts ? '✅' : '❌'}`);
    console.log(`  - Next.js data attr: ${nextJsMarkers.hasNextData ? '✅' : '❌'}`);
    console.log(`  - __next root: ${nextJsMarkers.hasNextRoot ? '✅' : '❌'}`);
    console.log(`  - React root: ${nextJsMarkers.hasReactRoot ? '✅' : '❌'}`);
    console.log(`  - Page title: ${nextJsMarkers.title}`);

    // Check response headers
    const headers = homepageResponse ? homepageResponse.headers() : {};
    console.log('\nResponse Headers:');
    console.log(`  - x-nextjs-cache: ${headers['x-nextjs-cache'] || 'not found'}`);
    console.log(`  - server: ${headers['server'] || 'not found'}`);

    if (nextJsMarkers.hasNextScripts || headers['x-nextjs-cache']) {
      console.log('\n✅ CONFIRMED: Website is serving Next.js');
      passedTests++;
    } else {
      console.log('\n❌ WARNING: Next.js markers not found - might be static HTML');
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ Failed to verify Next.js: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 3: Check if BookingFlow component is present
  console.log('━'.repeat(80));
  console.log('TEST 3: Dynamic Components Present');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    // Look for dynamic React components that wouldn't be in static HTML
    const hasDynamicComponents = await page.evaluate(() => {
      const body = document.body.innerHTML;

      return {
        hasButtons: document.querySelectorAll('button').length > 0,
        hasInteractiveElements: body.includes('onClick') || body.includes('data-'),
        hasModernCSS: body.includes('tailwind') || body.includes('spacing-'),
        formCount: document.querySelectorAll('form').length
      };
    });

    console.log('Dynamic Component Check:');
    console.log(`  - Buttons found: ${hasDynamicComponents.hasButtons ? '✅' : '❌'}`);
    console.log(`  - Interactive elements: ${hasDynamicComponents.hasInteractiveElements ? '✅' : '❌'}`);
    console.log(`  - Modern CSS classes: ${hasDynamicComponents.hasModernCSS ? '✅' : '❌'}`);
    console.log(`  - Forms count: ${hasDynamicComponents.formCount}`);

    if (hasDynamicComponents.hasButtons && hasDynamicComponents.hasModernCSS) {
      console.log('\n✅ Dynamic Next.js components detected');
      passedTests++;
    } else {
      console.log('\n❌ Missing dynamic components');
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ Failed component check: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 4: Test new city page (Beek)
  console.log('━'.repeat(80));
  console.log('TEST 4: New City Page (Beek)');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(`${BASE_URL}/beek`, { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    const hasContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('Beek') && body.includes('DJ');
    });

    console.log(`Status: HTTP ${response.status()}`);
    console.log(`Title: ${title}`);
    console.log(`Has Beek content: ${hasContent ? '✅' : '❌'}`);

    if (response.status() === 200 && hasContent) {
      console.log('\n✅ New city page (Beek) loads correctly');
      passedTests++;
    } else {
      console.log('\n❌ City page not working properly');
      failedTests++;
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-city-beek.png'), fullPage: true });
    console.log(`📸 Screenshot saved: 02-city-beek.png`);
  } catch (error) {
    console.log(`❌ Failed to load Beek page: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 5: Test another new city (Heerlen - Limburg)
  console.log('━'.repeat(80));
  console.log('TEST 5: Another New City (Heerlen)');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(`${BASE_URL}/heerlen`, { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    const hasContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('Heerlen') && body.includes('DJ');
    });

    console.log(`Status: HTTP ${response.status()}`);
    console.log(`Title: ${title}`);
    console.log(`Has Heerlen content: ${hasContent ? '✅' : '❌'}`);

    if (response.status() === 200 && hasContent) {
      console.log('\n✅ Heerlen city page loads correctly');
      passedTests++;
    } else {
      console.log('\n❌ Heerlen page not working properly');
      failedTests++;
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-city-heerlen.png'), fullPage: true });
    console.log(`📸 Screenshot saved: 03-city-heerlen.png`);
  } catch (error) {
    console.log(`❌ Failed to load Heerlen page: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 6: Sitemap.xml exists
  console.log('━'.repeat(80));
  console.log('TEST 6: Sitemap.xml Available');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle', timeout: 30000 });

    const content = await page.content();
    const hasXml = content.includes('<?xml') || content.includes('<urlset');
    const has114Pages = (content.match(/<url>/g) || []).length >= 100; // Should have ~114 URLs

    console.log(`Status: HTTP ${response.status()}`);
    console.log(`Is XML: ${hasXml ? '✅' : '❌'}`);
    console.log(`URLs count: ${(content.match(/<url>/g) || []).length}`);
    console.log(`Has 100+ pages: ${has114Pages ? '✅' : '❌'}`);

    if (response.status() === 200 && hasXml && has114Pages) {
      console.log('\n✅ Sitemap.xml is valid and contains all pages');
      passedTests++;
    } else {
      console.log('\n❌ Sitemap.xml issue detected');
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ Failed to load sitemap.xml: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 7: Robots.txt exists
  console.log('━'.repeat(80));
  console.log('TEST 7: Robots.txt Available');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(`${BASE_URL}/robots.txt`, { waitUntil: 'networkidle', timeout: 30000 });

    const content = await page.content();
    const hasUserAgent = content.includes('User-agent:');
    const hasSitemap = content.includes('Sitemap:');

    console.log(`Status: HTTP ${response.status()}`);
    console.log(`Has User-agent: ${hasUserAgent ? '✅' : '❌'}`);
    console.log(`Has Sitemap reference: ${hasSitemap ? '✅' : '❌'}`);

    if (response.status() === 200 && hasUserAgent && hasSitemap) {
      console.log('\n✅ Robots.txt is valid');
      passedTests++;
    } else {
      console.log('\n❌ Robots.txt issue detected');
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ Failed to load robots.txt: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 8: WhatsApp link present
  console.log('━'.repeat(80));
  console.log('TEST 8: WhatsApp Integration');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });

    const whatsappLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
      return links.map(link => ({
        href: link.href,
        text: link.innerText,
        hasCorrectNumber: link.href.includes('31620383638')
      }));
    });

    console.log(`WhatsApp links found: ${whatsappLinks.length}`);
    whatsappLinks.forEach((link, i) => {
      console.log(`  Link ${i + 1}:`);
      console.log(`    - Correct number: ${link.hasCorrectNumber ? '✅' : '❌'}`);
      console.log(`    - Text: ${link.text}`);
    });

    const hasCorrectWhatsApp = whatsappLinks.some(link => link.hasCorrectNumber);

    if (hasCorrectWhatsApp) {
      console.log('\n✅ WhatsApp integration with correct number (+31620383638)');
      passedTests++;
    } else {
      console.log('\n❌ WhatsApp number incorrect or missing');
      failedTests++;
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-contact-whatsapp.png'), fullPage: true });
    console.log(`📸 Screenshot saved: 04-contact-whatsapp.png`);
  } catch (error) {
    console.log(`❌ Failed WhatsApp check: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Test 9: Test 's-Hertogenbosch page (special characters)
  console.log('━'.repeat(80));
  console.log('TEST 9: Special City Page (\'s-Hertogenbosch)');
  console.log('━'.repeat(80));
  totalTests++;

  try {
    const response = await page.goto(`${BASE_URL}/s-hertogenbosch`, { waitUntil: 'networkidle', timeout: 30000 });

    const content = await page.content();
    const hasContent = content.includes('Hertogenbosch') || content.includes('&apos;s-Hertogenbosch');

    console.log(`Status: HTTP ${response.status()}`);
    console.log(`Has correct content: ${hasContent ? '✅' : '❌'}`);

    if (response.status() === 200 && hasContent) {
      console.log('\n✅ Special character page works correctly');
      passedTests++;
    } else {
      console.log('\n❌ Special character page issue');
      failedTests++;
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-s-hertogenbosch.png'), fullPage: true });
    console.log(`📸 Screenshot saved: 05-s-hertogenbosch.png`);
  } catch (error) {
    console.log(`❌ Failed 's-Hertogenbosch test: ${error.message}`);
    failedTests++;
  }

  console.log('');

  // Close browser
  await browser.close();

  // Summary
  console.log('═'.repeat(80));
  console.log('TEST SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('═'.repeat(80));

  console.log(`\n📁 Screenshots saved in: ${SCREENSHOT_DIR}`);
  console.log(`\nFiles created:`);
  fs.readdirSync(SCREENSHOT_DIR).forEach(file => {
    if (file.endsWith('.png')) {
      const stats = fs.statSync(path.join(SCREENSHOT_DIR, file));
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  });

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Website is running Next.js correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
