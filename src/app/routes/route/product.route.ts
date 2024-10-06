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
router.delete('/product/:productId', ProductControllers.deleteProduct);

export const ProductRoutes = router;
