import express from 'express';
import { paymentController } from '../../controllers/payment.controller';

const router = express.Router();

router.post(
  '/create-payment-intent',
  paymentController.createPaymentIntentController,
);

router.post('/confirm-payment', paymentController.confirmPaymentController);
router.post('/cod-order', paymentController.createCODOrderController);

export const PaymentRoutes = router;
