import { Request, Response } from 'express';
import Stripe from 'stripe';
import { paymentServices } from '../services/payment.service';

import dotenv from 'dotenv';
import orderModel from '../model/order.model';
import { ProductModel } from '../model/product.model';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is missing.');
}
const stripe = new Stripe(stripeSecretKey);

export const createPaymentIntentController = async (
  req: Request,
  res: Response,
) => {
  const { amount, products } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'No products provided for the order' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    const order = new orderModel({
      transactionId: paymentIntent.id, // Stripe transaction ID
      paymentStatus: 'unpaid',
      products,
    });

    await order.save();

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const confirmPaymentController = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  console.log('Confirming payment for:', paymentIntentId);

  if (!paymentIntentId) {
    return res
      .status(400)
      .json({ success: false, message: 'PaymentIntent ID is required' });
  }

  try {
    const paymentIntent = await paymentServices.confirmPayment(paymentIntentId);

    console.log('Payment intent status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      const order = await orderModel.findOne({
        transactionId: paymentIntentId,
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: 'Order not found' });
      }

      order.paymentStatus = 'paid';
      await order.save();

      console.log('Order found:', order);

      for (const product of order.products) {
        const productInDb = await ProductModel.findById(product.productId);

        if (!productInDb) {
          return res.status(404).json({
            success: false,
            message: `Product not found with ID: ${product.productId}`,
          });
        }

        productInDb.stock = Math.max(productInDb.stock - product.quantity, 0);
        await productInDb.save();
      }

      res.json({ success: true, paymentIntent, order });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed successfully',
      });
    }
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCODOrderController = async (req: Request, res: Response) => {
  const { user, products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'No products provided for the order' });
  }

  try {
    const order = new orderModel({
      user,
      paymentStatus: 'pending',
      products,
      transactionId: 'COD', // Set a placeholder value for COD orders
    });

    await order.save();

    for (const product of products) {
      const productInDb = await ProductModel.findById(product.productId);

      if (!productInDb) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID: ${product.productId}`,
        });
      }

      productInDb.stock = Math.max(productInDb.stock - product.quantity, 0);
      await productInDb.save();
    }

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating COD order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const paymentController = {
  createPaymentIntentController,
  confirmPaymentController,
  createCODOrderController,
};
