// src/tests/availability.test.ts
import request from 'supertest';
import app from '../app'; // Assuming your Express app is exported from app.ts

describe('GET /api/availability', () => {
    it('should return a list of available dates', async () => {
        const response = await request(app).get('/api/availability');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Check if the date format is correct
    });

    it('should handle errors and return a 500 status code', async () => {
        // Mock the service to throw an error
        jest.spyOn(require('../services/availabilityService').AvailabilityService.prototype, 'getAvailableDates')
            .mockImplementationOnce(() => {
                throw new Error('Internal Server Error');
            });

        const response = await request(app).get('/api/availability');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});
