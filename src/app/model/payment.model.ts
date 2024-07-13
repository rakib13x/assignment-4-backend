import { Schema, model } from 'mongoose';

interface PaymentDetails {
  productId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentId: string;
}

const paymentSchema = new Schema<PaymentDetails>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const PaymentModel = model<PaymentDetails>('Payment', paymentSchema);
