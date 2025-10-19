// pricingRouter.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import { getPricing } from './pricingController';

const router = express.Router();

router.post(
    '/api/pricing',
    [
        body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
        body('dateTime').isISO8601().withMessage('DateTime must be a valid ISO8601 date'),
    ],
    getPricing
);

export default router;
