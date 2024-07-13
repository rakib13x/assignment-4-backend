import { Router } from 'express';
import { PaymentRoutes } from './route/payment.route';
import { ProductRoutes } from './route/product.route';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleRoutes = [
  {
    path: '/',
    route: ProductRoutes,
  },
  {
    path: '/',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
