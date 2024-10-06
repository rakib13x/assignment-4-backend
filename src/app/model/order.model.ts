// src/order/order.model.ts

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;
