import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import routes from "@/routes";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";
import { apiLimiter } from "@/middleware/rateLimit";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(apiLimiter);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
