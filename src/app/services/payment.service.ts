import stripe from '../config/stripe';
import { PaymentModel } from '../model/payment.model';

interface PaymentData {
  productId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
}

const createPaymentIntent = async (paymentData: PaymentData) => {
  const { productId, amount, currency, paymentMethodId } = paymentData;

  try {
    // Convert amount to integer (smallest currency unit, e.g., cents)
    const amountInCents = Math.round(amount * 100);

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:3000/success', // Replace with your actual success URL
    });

    // Save payment details in the database
    const paymentDetails = await PaymentModel.create({
      productId,
      amount,
      currency,
      paymentStatus: paymentIntent.status,
      paymentId: paymentIntent.id,
    });

    return paymentDetails;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(error.message);
  }
};

export const PaymentServices = {
  createPaymentIntent,
};
