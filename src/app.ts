/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
import { PaymentRoutes } from './app/routes/route/payment.route';
import { ProductRoutes } from './app/routes/route/product.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

//application Routes
app.use('/api/v1', ProductRoutes);
app.use('/api/v1', PaymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from server.');
});

app.use(notFound);
export default app;
