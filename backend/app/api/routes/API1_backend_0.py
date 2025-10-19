// src/controllers/eventsController.ts
import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Op } from 'sequelize';

/**
 * GET /api/events
 * Fetches a list of events with optional filters.
 * Query parameters:
 * - name: Filter events by name (partial match)
 * - date: Filter events by exact date (YYYY-MM-DD)
 * - location: Filter events by location (partial match)
 * - minPrice: Filter events by minimum price
 * - maxPrice: Filter events by maximum price
 */
export const getEvents = async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const { name, date, location, minPrice, maxPrice } = req.query;

        // Build the filter object based on provided query parameters
        const filter: any = {};
        if (name) filter.name = { [Op.iLike]: `%${name}%` };
        if (date) filter.date = date;
        if (location) filter.location = { [Op.iLike]: `%${location}%` };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price[Op.gte] = parseFloat(minPrice as string);
            if (maxPrice) filter.price[Op.lte] = parseFloat(maxPrice as string);
        }

        // Fetch events from the database using the filter
        const events = await Event.findAll({ where: filter });

        // Return the filtered events
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Example usage:
// GET /api/events?name=Summer&location=New%20York&minPrice=100&maxPrice=500
// This would return events with "Summer" in the name, located in New York, and priced between $100 and $500.
