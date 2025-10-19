// form-validation.spec.ts

import { test, expect, Page } from '@playwright/test';

/**
 * Test suite for form validation errors
 * Tests various form validation scenarios including:
 * - Required field validation
 * - Email format validation
 * - Password requirements
 * - Custom validation messages
 */

// Test data
const TEST_DATA = {
  validEmail: 'test@example.com',
  invalidEmail: 'invalid-email',
  shortPassword: '123',
  validPassword: 'Password123!',
  validName: 'John Doe'
};

// Selectors
const SELECTORS = {
  form: '#registration-form',
  nameInput: '#name',
  emailInput: '#email',
  passwordInput: '#password',
  submitButton: 'button[type="submit"]',
  nameError: '[data-testid="name-error"]',
  emailError: '[data-testid="email-error"]',
  passwordError: '[data-testid="password-error"]'
};

// Helper function to fill form
async function fillForm(page: Page, {
  name = '',
  email = '',
  password = ''
}) {
  await page.fill(SELECTORS.nameInput, name);
  await page.fill(SELECTORS.emailInput, email);
  await page.fill(SELECTORS.passwordInput, password);
}

test.describe('Form Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form page before each test
    await page.goto('/register');
    await page.waitForSelector(SELECTORS.form);
  });

  test('should show required field errors when form is empty', async ({ page }) => {
    // Arrange
    await page.click(SELECTORS.submitButton);

    // Assert
    await expect(page.locator(SELECTORS.nameError)).toHaveText('Name is required');
    await expect(page.locator(SELECTORS.emailError)).toHaveText('Email is required');
    await expect(page.locator(SELECTORS.passwordError)).toHaveText('Password is required');
  });

  test('should show email format error for invalid email', async ({ page }) => {
    // Arrange
    await fillForm(page, {
      name: TEST_DATA.validName,
      email: TEST_DATA.invalidEmail,
      password: TEST_DATA.validPassword
    });

    // Act
    await page.click(SELECTORS.submitButton);

    // Assert
    await expect(page.locator(SELECTORS.emailError)).toHaveText('Please enter a valid email address');
  });

  test('should show password requirements error for short password', async ({ page }) => {
    // Arrange
    await fillForm(page, {
      name: TEST_DATA.validName,
      email: TEST_DATA.validEmail,
      password: TEST_DATA.shortPassword
    });

    // Act
    await page.click(SELECTORS.submitButton);

    // Assert
    await expect(page.locator(SELECTORS.passwordError))
      .toHaveText('Password must be at least 8 characters long');
  });

  test('should not show errors with valid input', async ({ page }) => {
    // Arrange
    await fillForm(page, {
      name: TEST_DATA.validName,
      email: TEST_DATA.validEmail,
      password: TEST_DATA.validPassword
    });

    // Act
    await page.click(SELECTORS.submitButton);

    // Assert
    await expect(page.locator(SELECTORS.nameError)).not.toBeVisible();
    await expect(page.locator(SELECTORS.emailError)).not.toBeVisible();
    await expect(page.locator(SELECTORS.passwordError)).not.toBeVisible();
  });

  test('should show error when name contains special characters', async ({ page }) => {
    // Arrange
    await fillForm(page, {
      name: 'Test@123',
      email: TEST_DATA.validEmail,
      password: TEST_DATA.validPassword
    });

    // Act
    await page.click(SELECTORS.submitButton);

    // Assert
    await expect(page.locator(SELECTORS.nameError))
      .toHaveText('Name should only contain letters and spaces');
  });
});
