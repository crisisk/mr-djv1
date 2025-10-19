// src/routes/whatsapp.routes.ts

import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { authenticateRequest } from '../middleware/auth';

const router = Router();
const whatsappController = new WhatsAppController();

router.post(
  '/booking-confirmation',
  authenticateRequest,
  whatsappController.sendBookingConfirmation
);

router.post(
  '/custom-message',
  authenticateRequest,
  whatsappController.sendCustomMessage
);

export default router;
