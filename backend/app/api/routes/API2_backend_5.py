import request from 'supertest';
import express from 'express';
import { createBooking } from './bookingsController';

const app = express();
app.use(express.json());
app.post('/api/bookings', createBooking);

describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
        const bookingData = {
            djId: '123',
            eventDate: '2023-12-25',
            eventName: 'Christmas Party',
            clientName: 'John Doe',
            clientEmail: 'john.doe@example.com',
            notes: 'Need a DJ for a Christmas party.',
        };

        const response = await request(app)
            .post('/api/bookings')
            .send(bookingData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('djId', bookingData.djId);
        expect(response.body).toHaveProperty('eventName', bookingData.eventName);
    });

    it('should return 400 for invalid booking data', async () => {
        const invalidBookingData = {
            djId: '123',
            eventDate: 'invalid-date',
            eventName: '',
            clientName: '',
            clientEmail: 'invalid-email',
        };

        const response = await request(app)
            .post('/api/bookings')
            .send(invalidBookingData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});
