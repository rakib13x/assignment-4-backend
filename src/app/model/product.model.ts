// model/product.model.ts
import { Document, Schema, model } from 'mongoose';
import { TProduct } from '../interface/product.interface';

interface ProductDocument extends TProduct, Document {}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: [String], required: true },
    ratings: { type: Number, required: true },
    images: { type: [String], required: true },
  },
  { timestamps: true },
);

// Virtual for 'id'
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', {
  virtuals: true,
});
export const ProductModel = model<ProductDocument>('Product', productSchema);
