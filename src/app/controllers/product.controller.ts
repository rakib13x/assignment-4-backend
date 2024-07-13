import httpStatus from 'http-status';

import { ProductServices } from '../services/product.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductsIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product is created succesfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { name, category, minPrice, maxPrice, sortOrder } = req.query;

  // Helper function to cast query params to string or undefined
  const toString = (
    value: string | ParsedQs | string[] | ParsedQs[],
  ): string | undefined => {
    if (Array.isArray(value)) {
      return value[0] as string;
    }
    return value as string;
  };

  const nameStr = toString(name);
  const categoryStr = toString(category);
  const sortOrderStr = toString(sortOrder);

  // Create regex for name
  const regex = nameStr ? new RegExp(nameStr, 'i') : undefined;

  // Parse minPrice and maxPrice to float, handling invalid cases
  const minPriceParsed = minPrice ? parseFloat(minPrice as string) : undefined;
  const maxPriceParsed = maxPrice ? parseFloat(maxPrice as string) : undefined;

  const products = await ProductServices.getAllProductsFromDb({
    name: regex,
    category: categoryStr,
    minPrice:
      minPriceParsed !== undefined && !isNaN(minPriceParsed)
        ? minPriceParsed
        : undefined,
    maxPrice:
      maxPriceParsed !== undefined && !isNaN(maxPriceParsed)
        ? maxPriceParsed
        : undefined,
    sortOrder: sortOrderStr,
  });

  if (products.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No products found!',
      data: [],
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products are retrieved successfully!',
    data: products,
  });
});
const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductFromDb(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product is retrieved successfully!',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
};
