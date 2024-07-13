import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, response: TResponse<T>): void => {
  const { statusCode, success, message, data } = response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseBody: any = {
    success,
    message,
    data,
  };

  res.status(statusCode).json(responseBody);
};

export default sendResponse;
