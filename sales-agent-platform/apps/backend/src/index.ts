import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./trpc/context";
import { prisma } from "./prisma";
import { requestLogger } from "./middleware/logger";
import { logger } from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// // CORS configuration
// // In development, allow all origins. In production, specify allowed origins.
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
//     : true, // Allow all origins in development
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info("Server started", { port: PORT, environment: process.env.NODE_ENV || "development" });
});

process.on("SIGTERM", () => {
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server closed gracefully");
  });
});
