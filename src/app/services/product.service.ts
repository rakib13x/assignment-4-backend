import { TProduct } from '../interface/product.interface';
import { ProductModel } from '../model/product.model';

const createProductsIntoDB = async (product: TProduct) => {
  const result = await ProductModel.create(product);
  return result;
};

export const ProductServices = {
  createProductsIntoDB,
};
