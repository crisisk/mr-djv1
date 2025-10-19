// authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';
const JWT_REFRESH_EXPIRES_IN = '7d';

/**
 * Login endpoint to authenticate user and return JWT tokens
 * @param req Express request object containing email and password
 * @param res Express response object to send JWT tokens or error
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

        // Send tokens in response
        res.status(200).json({ token, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Refresh token endpoint to generate new JWT token using refresh token
 * @param req Express request object containing refresh token
 * @param res Express response object to send new JWT token or error
 */
export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

        // Generate new JWT token
        const token = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Send new token in response
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token', error: error.message });
    }
};
