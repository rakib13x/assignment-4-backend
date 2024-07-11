import express from 'express';

import { ProductControllers } from './../../controllers/product.controller';

const router = express.Router();

router.post('/', ProductControllers.createProduct);
router.get('/allProducts', ProductControllers.createProduct);
router.get('/:productId', ProductControllers.getSingleProduct);

export const ProductRoutes = router;
