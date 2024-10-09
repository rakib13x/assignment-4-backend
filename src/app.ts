/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://assignment-4-client-amber.vercel.app',
  ], // Allow both origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Required if you're passing cookies or tokens
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

//application Routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from server.');
});

// app.use(notFound);
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});
export default app;
