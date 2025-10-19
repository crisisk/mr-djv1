// app.ts
import express from 'express';
import { rateLimiterMiddleware } from './rateLimiter';

const app = express();

// Apply rate limiting middleware to all routes
app.use(rateLimiterMiddleware);

// Example route
app.get('/book-dj', (req, res) => {
  res.json({ message: 'DJ booked successfully!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
