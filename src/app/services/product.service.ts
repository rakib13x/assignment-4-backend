import { SortOrder } from 'mongoose';

import { TProduct } from '../interface/product.interface';
import orderModel from '../model/order.model';
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
  } catch (error: any) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

const getSingleProductFromDb = async (id: string) => {
  const result = await ProductModel.findById(id);
  return result;
};

const deleteProductFromDb = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);
  return result;
};

const getBestSellingProductsFromDb = async () => {
  try {
    // Step 1: Get the best-selling products based on paid orders
    const bestSellingProducts = await orderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantitySold: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 }, // Limit the top results to 5 best-selling products
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 1,
          totalQuantitySold: 1,
          'productDetails.name': 1,
          'productDetails.price': 1,
          'productDetails.images': 1,
        },
      },
    ]);

    // Step 2: If there are fewer than 5 products, fetch additional products from the ProductModel
    if (bestSellingProducts.length < 5) {
      const remainingProductCount = 5 - bestSellingProducts.length;

      // Fetch additional products that are not already in the bestSellingProducts
      const additionalProducts = await ProductModel.find({
        _id: { $nin: bestSellingProducts.map((prod) => prod._id) },
      })
        .limit(remainingProductCount)
        .select('name price images') // Only select necessary fields
        .lean();

      // Step 3: Format the additional products to match the format of best-selling products
      const additionalFormattedProducts = additionalProducts.map((product) => ({
        _id: product._id,
        totalQuantitySold: 0, // Set as 0 since they are not part of best-selling
        productDetails: {
          name: product.name,
          price: product.price,
          images: product.images,
        },
      }));

      // Combine the best-selling products with additional products
      return [...bestSellingProducts, ...additionalFormattedProducts];
    }

    // Return the best-selling products if already 5 or more
    return bestSellingProducts;
  } catch (error: any) {
    throw new Error('Error fetching best-selling products: ' + error.message);
  }
};

const updateProductInDb = async (
  id: string,
  updatedData: Partial<TProduct>,
) => {
  try {
    const result = await ProductModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      throw new Error('Product not found');
    }

    return result;
  } catch (error: any) {
    throw new Error('Error updating product: ' + error.message);
  }
};

export const ProductServices = {
  createProductsIntoDB,
  getAllProductsFromDb,
  getSingleProductFromDb,
  deleteProductFromDb,
  getBestSellingProductsFromDb,
  updateProductInDb,
};
