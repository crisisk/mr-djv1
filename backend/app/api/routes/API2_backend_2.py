// bookingValidator.ts
import { BookingRequest } from '../models/BookingRequest';

/**
 * Validate the booking request.
 * 
 * @param bookingRequest - The booking request object to validate.
 * @returns string[] - An array of validation error messages.
 */
export function validateBookingRequest(bookingRequest: BookingRequest): string[] {
    const errors: string[] = [];

    if (!bookingRequest.djId) {
        errors.push('djId is required.');
    }

    if (!bookingRequest.eventDate || isNaN(Date.parse(bookingRequest.eventDate))) {
        errors.push('eventDate is required and must be a valid date.');
    }

    if (!bookingRequest.eventName || bookingRequest.eventName.trim().length === 0) {
        errors.push('eventName is required.');
    }

    if (!bookingRequest.clientName || bookingRequest.clientName.trim().length === 0) {
        errors.push('clientName is required.');
    }

    if (!bookingRequest.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingRequest.clientEmail)) {
        errors.push('clientEmail is required and must be a valid email address.');
    }

    return errors;
}
