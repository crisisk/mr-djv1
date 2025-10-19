// bookingsController.ts
import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { validateBookingRequest } from '../validators/bookingValidator';
import { Booking } from '../models/Booking';

const bookingService = new BookingService();

/**
 * POST /api/bookings
 * Create a new booking.
 * 
 * @param req - The request object containing booking details.
 * @param res - The response object to send back the result.
 */
export const createBooking = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const validationErrors = validateBookingRequest(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Extract booking details from the request body
        const { djId, eventDate, eventName, clientName, clientEmail, notes } = req.body;

        // Create a new booking object
        const newBooking: Booking = {
            djId,
            eventDate: new Date(eventDate),
            eventName,
            clientName,
            clientEmail,
            notes,
            status: 'Pending', // Default status
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Save the booking to the database
        const savedBooking = await bookingService.createBooking(newBooking);

        // Return the created booking with a 201 status
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'An unexpected error occurred while creating the booking.' });
    }
};
