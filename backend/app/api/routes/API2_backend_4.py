// repositories/bookingRepository.ts
import { Booking } from '../models/Booking';

export class BookingRepository {
    private bookings: Booking[] = [];

    /**
     * Save a booking to the database.
     * 
     * @param booking - The booking object to save.
     * @returns Promise<Booking> - The saved booking.
     */
    async save(booking: Booking): Promise<Booking> {
        return new Promise((resolve) => {
            this.bookings.push(booking);
            resolve(booking);
        });
    }
}
