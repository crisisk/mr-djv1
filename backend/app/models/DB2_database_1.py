// src/services/bookingService.ts
import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new booking
 * @param userId - ID of the user making the booking
 * @param djId - ID of the DJ being booked
 * @param eventDate - Date of the event
 * @param hoursBooked - Number of hours booked
 * @returns The created booking
 */
async function createBooking(
  userId: number,
  djId: number,
  eventDate: Date,
  hoursBooked: number
) {
  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        djId,
        eventDate,
        hoursBooked,
        status: BookingStatus.PENDING,
      },
    });
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
}

/**
 * Update booking status
 * @param bookingId - ID of the booking to update
 * @param status - New status for the booking
 * @returns The updated booking
 */
async function updateBookingStatus(bookingId: number, status: BookingStatus) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Get all bookings for a user
 * @param userId - ID of the user
 * @returns List of bookings for the user
 */
async function getUserBookings(userId: number) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error('Failed to fetch user bookings');
  }
}

// Example usage
async function main() {
  try {
    // Create a booking
    const newBooking = await createBooking(1, 1, new Date('2023-12-25'), 4);
    console.log('New Booking:', newBooking);

    // Update booking status
    const updatedBooking = await updateBookingStatus(newBooking.id, BookingStatus.CONFIRMED);
    console.log('Updated Booking:', updatedBooking);

    // Fetch user bookings
    const userBookings = await getUserBookings(1);
    console.log('User Bookings:', userBookings);
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
