/**
 * A/B Testing Utility - Test Suite
 *
 * Simple test to verify the A/B testing logic works correctly
 * This can be run in a browser console or with a proper test runner
 */

import { getCookie, setCookie, getOrAssignVariant } from './abTesting.js';

/**
 * Test helper to clear cookies
 */
const clearTestCookies = () => {
  document.cookie = 'mr_dj_ab_variant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Test helper to set URL parameters
 */
const mockURLParams = (params) => {
  const url = new URL(window.location);
  Object.keys(params).forEach(key => {
    url.searchParams.set(key, params[key]);
  });
  window.history.pushState({}, '', url);
};

/**
 * Run all tests
 */
export const runTests = () => {
  console.log('🧪 Starting A/B Testing Tests...\n');

  // Test 1: Cookie Set/Get
  console.log('Test 1: Cookie Set/Get');
  setCookie('test_cookie', 'test_value', 1);
  const testValue = getCookie('test_cookie');
  console.log(`✓ Cookie set and retrieved: ${testValue === 'test_value' ? 'PASS' : 'FAIL'}`);
  document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Test 2: Random Assignment
  console.log('\nTest 2: Random Assignment (50/50 split)');
  clearTestCookies();
  const assignments = { A: 0, B: 0 };

  // Run 100 assignments
  for (let i = 0; i < 100; i++) {
    clearTestCookies();
    const variant = getOrAssignVariant();
    assignments[variant]++;
  }

  console.log(`✓ Variant A: ${assignments.A}%, Variant B: ${assignments.B}%`);
  console.log(`✓ Distribution looks reasonable: ${assignments.A > 30 && assignments.B > 30 ? 'PASS' : 'FAIL'}`);

  // Test 3: Cookie Persistence
  console.log('\nTest 3: Cookie Persistence');
  clearTestCookies();
  const firstVariant = getOrAssignVariant();
  const secondVariant = getOrAssignVariant();
  const thirdVariant = getOrAssignVariant();
  console.log(`✓ First call: ${firstVariant}`);
  console.log(`✓ Second call: ${secondVariant}`);
  console.log(`✓ Third call: ${thirdVariant}`);
  console.log(`✓ Consistent across calls: ${firstVariant === secondVariant && secondVariant === thirdVariant ? 'PASS' : 'FAIL'}`);

  // Test 4: URL Override
  console.log('\nTest 4: URL Parameter Override');
  clearTestCookies();
  mockURLParams({ variant: 'B' });
  const overrideVariant = getOrAssignVariant();
  console.log(`✓ URL ?variant=B forces variant: ${overrideVariant === 'B' ? 'PASS' : 'FAIL'}`);

  // Clean up URL
  window.history.pushState({}, '', window.location.pathname);

  // Test 5: Cookie Expiration
  console.log('\nTest 5: Cookie Attributes');
  clearTestCookies();
  setCookie('mr_dj_ab_variant', 'A', 30);
  const cookieValue = getCookie('mr_dj_ab_variant');
  console.log(`✓ Cookie stored correctly: ${cookieValue === 'A' ? 'PASS' : 'FAIL'}`);

  console.log('\n✅ All tests completed!');
  clearTestCookies();
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.runABTests = runTests;
  console.log('💡 To run tests, type: window.runABTests()');
}
