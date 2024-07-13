import express from 'express';
import { PaymentControllers } from '../../controllers/payment.controller';

const router = express.Router();

router.post('/create-payment', PaymentControllers.createPayment);

export const PaymentRoutes = router;
