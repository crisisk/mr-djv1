// Example test using SuperTest and Jest
import request from 'supertest';
import app from '../src/app';

describe('POST /api/contact', () => {
    it('should submit the contact form successfully', async () => {
        const response = await request(app)
            .post('/api/contact')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                message: 'Hello, this is a test message.',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Contact form submitted successfully');
    });

    it('should return validation errors for invalid input', async () => {
        const response = await request(app)
            .post('/api/contact')
            .send({
                name: '',
                email: 'invalid-email',
                message: '',
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeInstanceOf(Array);
    });
});
