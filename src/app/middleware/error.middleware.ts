import type { ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error);
  response
    .status(500)
    .json({
      error:
        error instanceof Error ? error.message : "Unexpected server error.",
    });
};
