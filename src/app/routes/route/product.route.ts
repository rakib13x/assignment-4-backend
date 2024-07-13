import express from 'express';

import { ProductControllers } from './../../controllers/product.controller';

const router = express.Router();

router.post('/create-product', ProductControllers.createProduct);
router.get('/allProducts', ProductControllers.getAllProducts);
router.get('/product/:productId', ProductControllers.getSingleProduct);

export const ProductRoutes = router;
