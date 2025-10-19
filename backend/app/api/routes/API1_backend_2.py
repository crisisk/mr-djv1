// src/routes/eventsRoutes.ts
import express from 'express';
import { getEvents } from '../controllers/eventsController';

const router = express.Router();

// Define the GET /api/events endpoint
router.get('/api/events', getEvents);

export default router;
