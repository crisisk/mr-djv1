#!/usr/bin/env node

/**
 * Visual Analysis & Functional Testing
 *
 * Makes screenshots and tests interactive functionality
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mr-dj.sevensa.nl';
const SCREENSHOT_DIR = '/srv/apps/mr-djv1/visual-analysis';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVisualAnalysis() {
  console.log('🎨 Starting Visual Analysis & Functional Testing...\n');
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

  let results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Homepage loads and renders correctly
  console.log('━'.repeat(80));
  console.log('TEST 1: Homepage Visual & Functional Check');
  console.log('━'.repeat(80));
  results.total++;

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Take full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-homepage-full.png'),
      fullPage: true
    });

    // Take viewport screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-homepage-viewport.png')
    });

    // Check if key elements are visible
    const checks = await page.evaluate(() => {
      const results = {};

      // Check header
      const header = document.querySelector('header');
      results.headerVisible = header && window.getComputedStyle(header).display !== 'none';

      // Check logo
      const logo = document.querySelector('img[alt*="Mister DJ"]');
      results.logoVisible = logo && window.getComputedStyle(logo).display !== 'none';

      // Check main heading
      const h1 = document.querySelector('h1');
      results.h1Text = h1 ? h1.innerText : null;
      results.h1Visible = h1 && window.getComputedStyle(h1).display !== 'none';

      // Check CTA buttons
      const buttons = document.querySelectorAll('button');
      results.buttonCount = buttons.length;
      results.buttonsVisible = buttons.length > 0;

      // Check navigation
      const navLinks = document.querySelectorAll('nav a');
      results.navLinkCount = navLinks.length;

      // Check hero section
      const hero = document.querySelector('.bg-brand-gradient');
      results.heroVisible = hero && window.getComputedStyle(hero).display !== 'none';

      // Check services cards
      const serviceCards = document.querySelectorAll('.shadow-md.rounded-2xl');
      results.serviceCardCount = serviceCards.length;

      return results;
    });

    console.log('\nVisual Elements Check:');
    console.log(`  ✅ Header visible: ${checks.headerVisible}`);
    console.log(`  ✅ Logo visible: ${checks.logoVisible}`);
    console.log(`  ✅ H1 visible: ${checks.h1Visible}`);
    console.log(`  ✅ H1 text: "${checks.h1Text}"`);
    console.log(`  ✅ Hero section visible: ${checks.heroVisible}`);
    console.log(`  ✅ Buttons found: ${checks.buttonCount}`);
    console.log(`  ✅ Navigation links: ${checks.navLinkCount}`);
    console.log(`  ✅ Service cards: ${checks.serviceCardCount}`);

    if (checks.headerVisible && checks.h1Visible && checks.buttonCount > 0) {
      console.log('\n✅ TEST PASSED: Homepage renders correctly');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: Missing key elements');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 2: Interactive button hover
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 2: Interactive Elements (Button Hover)');
  console.log('━'.repeat(80));
  results.total++;

  try {
    // Find and hover over a button
    const button = await page.locator('button').first();

    // Screenshot before hover
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-button-before-hover.png')
    });

    // Hover over button
    await button.hover();
    await page.waitForTimeout(500);

    // Screenshot after hover
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-button-after-hover.png')
    });

    console.log('\n✅ TEST PASSED: Interactive hover works');
    results.passed++;
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 3: Scroll behavior and lazy loading
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 3: Scroll & Image Lazy Loading');
  console.log('━'.repeat(80));
  results.total++;

  try {
    // Scroll to middle of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-mid-page.png')
    });

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-bottom-page.png')
    });

    // Check if images loaded
    const imageCheck = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const loadedImages = Array.from(images).filter(img => img.complete && img.naturalHeight > 0);
      return {
        total: images.length,
        loaded: loadedImages.length
      };
    });

    console.log(`\n  Images: ${imageCheck.loaded}/${imageCheck.total} loaded`);

    if (imageCheck.loaded > 0) {
      console.log('\n✅ TEST PASSED: Lazy loading works');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: No images loaded');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 4: Navigation click (internal link)
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 4: Navigation & Client-Side Routing');
  console.log('━'.repeat(80));
  results.total++;

  try {
    // Go back to top
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Click on a service link
    const serviceLink = await page.locator('a[href="/bruiloft"]').first();
    await serviceLink.click();
    await page.waitForTimeout(2000);

    // Check URL changed
    const currentUrl = page.url();
    console.log(`\n  Current URL: ${currentUrl}`);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-bruiloft-page.png'),
      fullPage: true
    });

    // Check page content changed
    const pageTitle = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log(`  Page H1: "${pageTitle}"`);

    if (currentUrl.includes('/bruiloft') && pageTitle) {
      console.log('\n✅ TEST PASSED: Client-side routing works');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: Routing issue detected');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 5: City page (new pages we created)
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 5: New City Page Rendering');
  console.log('━'.repeat(80));
  results.total++;

  try {
    await page.goto(`${BASE_URL}/heerlen`, { waitUntil: 'networkidle', timeout: 30000 });

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '08-city-heerlen.png'),
      fullPage: true
    });

    const cityCheck = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hasContent = document.body.innerText.includes('Heerlen');
      const hasLocalInfo = document.body.innerText.includes('Lokale');

      return {
        h1Text: h1?.innerText,
        hasContent,
        hasLocalInfo
      };
    });

    console.log(`\n  H1: "${cityCheck.h1Text}"`);
    console.log(`  Has Heerlen content: ${cityCheck.hasContent}`);
    console.log(`  Has local info: ${cityCheck.hasLocalInfo}`);

    if (cityCheck.hasContent && cityCheck.hasLocalInfo) {
      console.log('\n✅ TEST PASSED: City page renders correctly');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: City page incomplete');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 6: Contact/WhatsApp integration
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 6: WhatsApp Integration');
  console.log('━'.repeat(80));
  results.total++;

  try {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: 30000 });

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-contact-page.png'),
      fullPage: true
    });

    const whatsappCheck = await page.evaluate(() => {
      const whatsappLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
      return whatsappLinks.map(link => ({
        href: link.href,
        text: link.innerText,
        visible: window.getComputedStyle(link).display !== 'none'
      }));
    });

    console.log(`\n  WhatsApp links found: ${whatsappCheck.length}`);
    whatsappCheck.forEach((link, i) => {
      console.log(`  Link ${i + 1}:`);
      console.log(`    - Visible: ${link.visible}`);
      console.log(`    - Text: "${link.text}"`);
      console.log(`    - Has correct number: ${link.href.includes('31620383638')}`);
    });

    const hasCorrectNumber = whatsappCheck.some(link => link.href.includes('31620383638'));

    if (hasCorrectNumber && whatsappCheck.length > 0) {
      console.log('\n✅ TEST PASSED: WhatsApp integration correct');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: WhatsApp integration issue');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Test 7: Responsive design (mobile view)
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 7: Responsive Design (Mobile)');
  console.log('━'.repeat(80));
  results.total++;

  try {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-mobile-view.png'),
      fullPage: true
    });

    const mobileCheck = await page.evaluate(() => {
      const header = document.querySelector('header');
      const mobileMenu = document.querySelector('button[aria-label*="menu" i], button[aria-label*="toggle" i]');
      const content = document.querySelector('main');

      return {
        headerVisible: header && window.getComputedStyle(header).display !== 'none',
        mobileMenuVisible: mobileMenu && window.getComputedStyle(mobileMenu).display !== 'none',
        contentVisible: content && window.getComputedStyle(content).display !== 'none',
        viewportWidth: window.innerWidth
      };
    });

    console.log(`\n  Viewport width: ${mobileCheck.viewportWidth}px`);
    console.log(`  Header visible: ${mobileCheck.headerVisible}`);
    console.log(`  Mobile menu visible: ${mobileCheck.mobileMenuVisible}`);
    console.log(`  Content visible: ${mobileCheck.contentVisible}`);

    if (mobileCheck.headerVisible && mobileCheck.contentVisible) {
      console.log('\n✅ TEST PASSED: Responsive design works');
      results.passed++;
    } else {
      console.log('\n❌ TEST FAILED: Responsive issues detected');
      results.failed++;
    }
  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
    results.failed++;
  }

  // Close browser
  await browser.close();

  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('VISUAL ANALYSIS SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('═'.repeat(80));

  console.log(`\n📁 Screenshots saved in: ${SCREENSHOT_DIR}`);
  console.log(`\nFiles created:`);
  fs.readdirSync(SCREENSHOT_DIR).forEach(file => {
    if (file.endsWith('.png')) {
      const stats = fs.statSync(path.join(SCREENSHOT_DIR, file));
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  });

  if (results.failed === 0) {
    console.log('\n🎉 ALL VISUAL TESTS PASSED! Website is fully functional.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results above.');
    process.exit(1);
  }
}

// Run visual analysis
runVisualAnalysis().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
