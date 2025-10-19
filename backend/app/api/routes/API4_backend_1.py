// src/routes/contactRoutes.ts
import express from 'express';
import { submitContactForm } from '../controllers/contactController';

const router = express.Router();

// Define the POST /api/contact route
router.post('/contact', submitContactForm);

export default router;
