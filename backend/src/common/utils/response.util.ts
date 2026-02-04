import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message?: string
) => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  return res.status(statusCode).json(response);
};
