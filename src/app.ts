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

app.use(
  cors({
    origin: 'https://assignment-4-client-amber.vercel.app',
    credentials: true,
  }),
);

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   }),
// );

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
