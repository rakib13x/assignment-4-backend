import express from 'express';
import { paymentController } from '../../controllers/payment.controller';

// console.log('paymentController:', paymentController);

const router = express.Router();

// router.get('/test', (req, res) => {
//   res.json({ success: true, message: 'Payment route is working!' });
// });

router.post(
  '/create-payment-intent',
  paymentController.createPaymentIntentController,
);

// Confirm Payment
router.post('/confirm-payment', paymentController.confirmPaymentController);

// console.log('Payment Router Initialized');

export const PaymentRoutes = router;
