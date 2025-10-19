// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the contact routes
app.use('/api', contactRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
