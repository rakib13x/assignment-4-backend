// In src/models/car.model.ts
import { Schema, model } from 'mongoose';
import { TProduct } from '../interface/product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      default: [],
    },
    ratings: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<TProduct>('Product', productSchema);
