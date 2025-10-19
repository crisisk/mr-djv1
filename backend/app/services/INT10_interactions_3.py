// routes/paymentRoutes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = Router();
const paymentController = new PaymentController();

router.post('/create', paymentController.initiatePayment);
router.post('/webhook', paymentController.handleWebhook);
router.get('/return', paymentController.handleReturn);

export default router;
