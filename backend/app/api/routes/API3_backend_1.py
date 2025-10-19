// src/services/availabilityService.ts
import { ApiError } from '../utils/apiError';

export class AvailabilityService {
    /**
     * Retrieves the available dates for DJ bookings.
     * This is a mock implementation. In a real-world scenario, this would query a database or external service.
     * @returns {Promise<string[]>} A list of available dates in 'YYYY-MM-DD' format.
     */
    async getAvailableDates(): Promise<string[]> {
        try {
            // Mock data representing available dates
            const availableDates = [
                '2023-12-25',
                '2023-12-31',
                '2024-01-01',
            ];

            return availableDates;
        } catch (error) {
            throw new ApiError('Failed to retrieve availability data', 500);
        }
    }
}
