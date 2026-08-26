import cors from "cors";
import express from "express";
import { env } from "./app/config/env";
import { apiRouter } from "./app/routes";
import { errorHandler } from "./app/middleware/error.middleware";
import { notFoundMiddleware } from "./app/middleware/not-found.middleware";

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api", apiRouter);
app.use(notFoundMiddleware);
app.use(errorHandler);
