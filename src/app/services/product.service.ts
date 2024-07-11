import { TProduct } from '../interface/product.interface';
import { ProductModel } from '../model/product.model';

const createProductsIntoDB = async (product: TProduct) => {
  const result = await ProductModel.create(product);
  return result;
};

const getAllProductsFromDb = async (regex?: RegExp) => {
  try {
    const result = regex
      ? await ProductModel.find({ name: { $regex: regex } })
      : await ProductModel.find();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

const getSingleProductFromDb = async (id: string) => {
  const result = await ProductModel.findById(id);
  return result;
};

export const ProductServices = {
  createProductsIntoDB,
  getAllProductsFromDb,
  getSingleProductFromDb,
};
