// src/route/product.route.ts

import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { ProductControllers } from '../../controllers/product.controller';

const router = express.Router();

router.post(
  '/create-product',
  multerUpload.array('images', 10),
  ProductControllers.createProduct,
);
router.get('/allProducts', ProductControllers.getAllProducts);
router.get('/product/:productId', ProductControllers.getSingleProduct);
router.get('/best-selling', ProductControllers.getBestSellingProducts);
router.put(
  '/products/:productId',
  multerUpload.array('images', 10),
  ProductControllers.updateProduct,
);
router.delete('/products/:productId', ProductControllers.deleteProduct);

export const ProductRoutes = router;
