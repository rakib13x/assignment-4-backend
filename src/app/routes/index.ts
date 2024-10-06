import { Router } from 'express';

import { PaymentRoutes } from './route/payment.route';
import { ProductRoutes } from './route/product.route';

// console.log('PaymentRoutes:', PaymentRoutes);
// console.log('ProductRoutes:', ProductRoutes);

const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: ProductRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
