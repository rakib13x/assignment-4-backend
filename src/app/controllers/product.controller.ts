// controllers/product.controller.ts
import httpStatus from 'http-status';
import { ParsedQs } from 'qs';
import { cloudinaryUpload } from '../config/cloudinary.config';
import { ProductServices } from '../services/product.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const createProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'At least one image is required!',
    });
  }

  const uploadedImages = await Promise.all(
    files.map(async (file: Express.Multer.File) => {
      const result = await cloudinaryUpload.uploader.upload(file.path);
      return result.secure_url;
    }),
  );

  const productData = {
    ...req.body,
    images: uploadedImages,
  };

  const result = await ProductServices.createProductsIntoDB(productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product is created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { name, category, minPrice, maxPrice, sortOrder } = req.query;

  const toString = (
    value: string | ParsedQs | string[] | ParsedQs[],
  ): string | undefined => {
    if (Array.isArray(value)) {
      return value[0] as string;
    }
    return value as string;
  };

  const nameStr = toString(name || '');
  const categoryStr = toString(category || '');
  const sortOrderStr = toString(sortOrder || '');

  const regex = nameStr ? new RegExp(nameStr, 'i') : undefined;

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

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      products.length === 0
        ? 'No products found!'
        : 'All products retrieved successfully!',
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

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const deletedProduct = await ProductServices.deleteProductFromDb(productId);

  if (!deletedProduct) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
