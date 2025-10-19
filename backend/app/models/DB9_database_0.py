// src/database/indexes.ts
import mongoose from 'mongoose';
import { Booking } from './models/booking.model';

/**
 * Creates performance-optimized indexes for Booking collection
 * Focuses on date (for date-range queries) and status (for filtering)
 */
export async function createBookingIndexes(): Promise<void> {
  try {
    // Compound index for date (ascending) and status
    await Booking.collection.createIndexes([
      {
        key: { date: 1 }, // Single index for date sorting
        name: 'date_ascending'
      },
      {
        key: { status: 1 }, // Single index for status filtering
        name: 'status_index'
      },
      {
        key: { date: 1, status: 1 }, // Compound index for common query patterns
        name: 'date_status_compound'
      }
    ]);

    console.log('Booking indexes created successfully');
  } catch (error) {
    console.error('Failed to create booking indexes:', error);
    throw new Error('Index creation failed');
  }
}

// Example usage
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    await createBookingIndexes();
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
})();

/* TEST CASE:
1. Connect to a test database
2. Run the function
3. Verify indexes exist with:
   db.bookings.getIndexes()
4. Should see the three new indexes
*/
