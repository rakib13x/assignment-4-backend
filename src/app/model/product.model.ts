import { Document, Schema, Types, model } from 'mongoose';

interface ProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string[];
  ratings: number;
  images: string[];
}

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

productSchema.virtual('id').get(function (
  this: ProductDocument & { _id: Types.ObjectId },
) {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

export const ProductModel = model<ProductDocument>('Product', productSchema);
