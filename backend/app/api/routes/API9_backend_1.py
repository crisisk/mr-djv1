// authRoutes.ts
import express from 'express';
import { login, refreshToken } from '../controllers/authController';

const router = express.Router();

// Login route
router.post('/login', login);

// Refresh token route
router.post('/refresh-token', refreshToken);

export default router;
