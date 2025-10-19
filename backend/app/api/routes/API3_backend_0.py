// src/routes/availability.ts
import { Request, Response } from 'express';
import { AvailabilityService } from '../services/availabilityService';
import { ApiError } from '../utils/apiError';

const availabilityService = new AvailabilityService();

/**
 * @swagger
 * /api/availability:
 *   get:
 *     summary: Retrieve available dates for DJ bookings
 *     description: Fetches a list of dates that are available for booking a DJ.
 *     responses:
 *       200:
 *         description: A list of available dates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-25"
 *       500:
 *         description: Internal server error
 */
export const getAvailability = async (req: Request, res: Response) => {
    try {
        // Fetch available dates from the service layer
        const availableDates = await availabilityService.getAvailableDates();

        // Send the response with the available dates
        res.status(200).json(availableDates);
    } catch (error) {
        // Handle errors and send a meaningful response
        const statusCode = error instanceof ApiError ? error.statusCode : 500;
        const message = error instanceof ApiError ? error.message : 'Internal Server Error';
        res.status(statusCode).json({ error: message });
    }
};
