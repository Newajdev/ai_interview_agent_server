import type { ErrorRequestHandler } from "express";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error);
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    response.status(status).json({ error: error.message });
    return;
  }

  const statusCode =
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
      ? error.statusCode
      : 500;
  response.status(statusCode).json({
    error: error instanceof Error ? error.message : "Unexpected server error.",
  });
};
