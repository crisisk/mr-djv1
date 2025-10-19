// bookingService.ts
import { Booking } from '../models/Booking';
import { BookingRepository } from '../repositories/bookingRepository';

const bookingRepository = new BookingRepository();

export class BookingService {
    /**
     * Create a new booking in the database.
     * 
     * @param booking - The booking object to create.
     * @returns Promise<Booking> - The created booking.
     */
    async createBooking(booking: Booking): Promise<Booking> {
        try {
            return await bookingRepository.save(booking);
        } catch (error) {
            console.error('Error saving booking:', error);
            throw new Error('Failed to save booking to the database.');
        }
    }
}
