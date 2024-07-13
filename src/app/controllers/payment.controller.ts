import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { PaymentServices } from '../services/payment.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { productId, amount, currency, paymentMethodId } = req.body;

  if (!productId || !amount || !currency || !paymentMethodId) {
    console.error('Missing required parameters:', req.body);
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Missing required parameters',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.error('Invalid productId format:', productId);
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid productId format',
    });
  }

  try {
    const paymentDetails = await PaymentServices.createPaymentIntent({
      productId: new mongoose.Types.ObjectId(productId),
      amount,
      currency,
      paymentMethodId,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment processed successfully',
      data: paymentDetails,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Payment processing failed',
      data: error.message,
    });
  }
});

export const PaymentControllers = {
  createPayment,
};
