import mongoose, { Document, Schema } from 'mongoose';

interface Product {
  productId: string;
  quantity: number;
  price: number;
}

interface Order extends Document {
  transactionId?: string;
  user: any;
  paymentStatus: 'unpaid' | 'paid' | 'pending';
  products: Product[];
}

const orderSchema = new Schema<Order>({
  transactionId: { type: String, required: false },
  user: { type: Object, required: false },
  paymentStatus: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const orderModel = mongoose.model<Order>('Order', orderSchema);

export default orderModel;
