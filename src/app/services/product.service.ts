import { SortOrder } from 'mongoose';
import { TProduct } from '../interface/product.interface';
import { ProductModel } from '../model/product.model';
interface QueryParams {
  name?: RegExp;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortOrder?: string;
}

const createProductsIntoDB = async (product: TProduct) => {
  const result = await ProductModel.create(product);
  return result;
};

const getAllProductsFromDb = async ({
  name,
  category,
  minPrice,
  maxPrice,
  sortOrder,
}: QueryParams) => {
  try {
    let query: any = {};
    if (name) {
      query.name = { $regex: name };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice !== undefined) {
      query.price = { ...query.price, $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    const sort: { [key: string]: SortOrder } =
      sortOrder === 'desc' ? { price: -1 } : { price: 1 };

    const result = await ProductModel.find(query).sort(sort);

    return result;
  } catch (error) {
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
