// pricingController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Define the pricing model
interface PricingModel {
    basePrice: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    durationDiscount: number;
}

// Define the request body structure
interface PricingRequest {
    duration: number; // Duration in hours
    dateTime: Date; // Event date and time
}

// Define the response structure
interface PricingResponse {
    totalPrice: number;
    basePrice: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    durationDiscount: number;
}

// Pricing model configuration
const pricingModel: PricingModel = {
    basePrice: 100, // Base price per hour
    peakHourMultiplier: 1.5, // Multiplier for peak hours (6 PM - 10 PM)
    weekendMultiplier: 1.2, // Multiplier for weekends
    durationDiscount: 0.9, // Discount for bookings longer than 4 hours
};

// Helper function to check if a given time is within peak hours
const isPeakHour = (dateTime: Date): boolean => {
    const hour = dateTime.getHours();
    return hour >= 18 && hour < 22;
};

// Helper function to check if a given date is a weekend
const isWeekend = (dateTime: Date): boolean => {
    const day = dateTime.getDay();
    return day === 0 || day === 6;
};

// Main function to calculate pricing
const calculatePricing = (duration: number, dateTime: Date): PricingResponse => {
    const basePrice = pricingModel.basePrice * duration;

    let peakHourMultiplier = 1;
    if (isPeakHour(dateTime)) {
        peakHourMultiplier = pricingModel.peakHourMultiplier;
    }

    let weekendMultiplier = 1;
    if (isWeekend(dateTime)) {
        weekendMultiplier = pricingModel.weekendMultiplier;
    }

    let durationDiscount = 1;
    if (duration > 4) {
        durationDiscount = pricingModel.durationDiscount;
    }

    const totalPrice = basePrice * peakHourMultiplier * weekendMultiplier * durationDiscount;

    return {
        totalPrice,
        basePrice,
        peakHourMultiplier,
        weekendMultiplier,
        durationDiscount,
    };
};

// REST API endpoint handler
export const getPricing = (req: Request, res: Response) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { duration, dateTime }: PricingRequest = req.body;

    try {
        const pricingResponse = calculatePricing(duration, new Date(dateTime));
        res.status(200).json(pricingResponse);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Example usage/test
// const testRequest: PricingRequest = {
//     duration: 5,
//     dateTime: new Date('2023-10-07T19:00:00'),
// };

// const testResponse = calculatePricing(testRequest.duration, testRequest.dateTime);
// console.log(testResponse);
// Expected output:
// {
//     totalPrice: 540,
//     basePrice: 500,
//     peakHourMultiplier: 1.5,
//     weekendMultiplier: 1.2,
//     durationDiscount: 0.9,
// }
