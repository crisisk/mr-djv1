// src/tests/bookingService.test.ts
import { PrismaClient } from '@prisma/client';
import {
  createBooking,
  updateBookingStatus,
  getUserBookings,
} from '../services/bookingService';

const prisma = new PrismaClient();

describe('Booking Service', () => {
  beforeAll(async () => {
    // Setup: Create a user and DJ for testing
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
      },
    });
    await prisma.dJ.create({
      data: {
        name: 'Test DJ',
        email: 'testdj@example.com',
      },
    });
  });

  afterAll(async () => {
    // Cleanup: Delete all bookings, users, and DJs
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dJ.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a booking', async () => {
    const booking = await createBooking(1, 1, new Date('2023-12-25'), 4);
    expect(booking).toHaveProperty('id');
    expect(booking.status).toBe('PENDING');
  });

  it('should update booking status', async () => {
    const booking = await createBooking(1, 1, new Date('2023-12-25'), 4);
    const updatedBooking = await updateBookingStatus(booking.id, 'CONFIRMED');
    expect(updatedBooking.status).toBe('CONFIRMED');
  });

  it('should fetch user bookings', async () => {
    await createBooking(1, 1, new Date('2023-12-25'), 4);
    const bookings = await getUserBookings(1);
    expect(bookings.length).toBeGreaterThan(0);
  });
});
