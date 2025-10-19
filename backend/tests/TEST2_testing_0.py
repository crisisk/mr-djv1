// booking.spec.ts

import { test, expect, Page } from '@playwright/test';
import { BookingPage } from './pages/booking-page';
import { CheckoutPage } from './pages/checkout-page';
import { ConfirmationPage } from './pages/confirmation-page';
import { TestData } from './test-data/booking-data';
import { Logger } from './utils/logger';

/**
 * Test suite for the end-to-end booking flow
 * Covers the happy path scenario from selection to confirmation
 */
test.describe('Booking Flow - Happy Path', () => {
  let bookingPage: BookingPage;
  let checkoutPage: CheckoutPage;
  let confirmationPage: ConfirmationPage;
  let logger: Logger;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    logger = new Logger();
    bookingPage = new BookingPage(page);
    checkoutPage = new CheckoutPage(page);
    confirmationPage = new ConfirmationPage(page);
    
    // Navigate to the booking page
    await bookingPage.goto();
  });

  test('Complete booking flow successfully', async ({ page }) => {
    // Test data
    const bookingData = TestData.validBooking;

    try {
      // Step 1: Select dates
      await test.step('Select booking dates', async () => {
        await bookingPage.selectDates(
          bookingData.checkIn,
          bookingData.checkOut
        );
        
        // Verify date selection
        const selectedDates = await bookingPage.getSelectedDates();
        expect(selectedDates.checkIn).toBe(bookingData.checkIn);
        expect(selectedDates.checkOut).toBe(bookingData.checkOut);
      });

      // Step 2: Select room type
      await test.step('Select room type', async () => {
        await bookingPage.selectRoomType(bookingData.roomType);
        
        // Verify room selection
        const selectedRoom = await bookingPage.getSelectedRoomType();
        expect(selectedRoom).toBe(bookingData.roomType);
      });

      // Step 3: Fill guest details
      await test.step('Fill guest details', async () => {
        await bookingPage.fillGuestDetails({
          firstName: bookingData.guest.firstName,
          lastName: bookingData.guest.lastName,
          email: bookingData.guest.email,
          phone: bookingData.guest.phone
        });
      });

      // Step 4: Proceed to checkout
      await test.step('Proceed to checkout', async () => {
        await bookingPage.proceedToCheckout();
        
        // Verify navigation to checkout page
        await expect(page).toHaveURL(/.*checkout/);
      });

      // Step 5: Fill payment details
      await test.step('Fill payment details', async () => {
        await checkoutPage.fillPaymentDetails({
          cardNumber: bookingData.payment.cardNumber,
          expiryDate: bookingData.payment.expiryDate,
          cvv: bookingData.payment.cvv
        });
      });

      // Step 6: Complete booking
      await test.step('Complete booking', async () => {
        await checkoutPage.confirmBooking();
        
        // Verify navigation to confirmation page
        await expect(page).toHaveURL(/.*confirmation/);
      });

      // Step 7: Verify booking confirmation
      await test.step('Verify booking confirmation', async () => {
        const bookingReference = await confirmationPage.getBookingReference();
        expect(bookingReference).toBeTruthy();
        
        const confirmationDetails = await confirmationPage.getBookingDetails();
        expect(confirmationDetails.guest.email).toBe(bookingData.guest.email);
        expect(confirmationDetails.roomType).toBe(bookingData.roomType);
      });

    } catch (error) {
      logger.error(`Booking flow test failed: ${error.message}`);
      throw error;
    }
  });
});

// Page Object Model implementations

export class BookingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(process.env.BOOKING_URL || 'https://example.com/booking');
  }

  async selectDates(checkIn: string, checkOut: string) {
    await this.page.fill('[data-testid="check-in"]', checkIn);
    await this.page.fill('[data-testid="check-out"]', checkOut);
  }

  async getSelectedDates() {
    return {
      checkIn: await this.page.inputValue('[data-testid="check-in"]'),
      checkOut: await this.page.inputValue('[data-testid="check-out"]')
    };
  }

  async selectRoomType(roomType: string) {
    await this.page.click(`[data-testid="room-type-${roomType}"]`);
  }

  async getSelectedRoomType() {
    return this.page.getAttribute('[data-testid="selected-room"]', 'data-value');
  }

  async fillGuestDetails(details: any) {
    await this.page.fill('[data-testid="guest-firstname"]', details.firstName);
    await this.page.fill('[data-testid="guest-lastname"]', details.lastName);
    await this.page.fill('[data-testid="guest-email"]', details.email);
    await this.page.fill('[data-testid="guest-phone"]', details.phone);
  }

  async proceedToCheckout() {
    await this.page.click('[data-testid="proceed-checkout"]');
  }
}

// Test data example
export const TestData = {
  validBooking: {
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    roomType: 'deluxe',
    guest: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890'
    },
    payment: {
      cardNumber: '4111111111111111',
      expiryDate: '12/25',
      cvv: '123'
    }
  }
};
