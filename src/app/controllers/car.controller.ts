import httpStatus from 'http-status';

import { ProductServices } from '../services/product.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductsIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car is created succesfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
};
