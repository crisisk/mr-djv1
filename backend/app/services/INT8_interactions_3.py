// src/routes/notifications.ts

import express from 'express';
import { NotificationController } from '../controllers/notificationController';

const router = express.Router();
const notificationController = new NotificationController();

router.post('/send-event-notification', 
  notificationController.sendEventNotification.bind(notificationController)
);

export default router;
