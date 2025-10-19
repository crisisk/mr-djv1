// Example usage/tests
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes';
import { User } from './userModel';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/mrdj_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    it('should login and return tokens', async () => {
        const user = new User({ email: 'test@example.com', password: 'password123' });
        await user.save();

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });

    it('should refresh token', async () => {
        const user = new User({ email: 'test@example.com', password: 'password123' });
        await user.save();

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .post('/auth/refresh-token')
            .send({ refreshToken: loginRes.body.refreshToken });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
