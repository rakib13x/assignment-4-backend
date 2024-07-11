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
  const { name } = req.query;
  const regex = name ? new RegExp(name as string, 'i') : undefined;
  const products = await ProductServices.getAllProductsFromDb(regex);

  if (products.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'All products is retrieved successfully !',
      data: [],
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products is retrieved successfully !',
    data: products,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { carId } = req.params;
  const result = await ProductServices.getSingleProductFromDb(carId);
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
