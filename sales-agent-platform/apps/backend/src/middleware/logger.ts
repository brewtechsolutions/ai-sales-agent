/**
 * Request Logging Middleware
 * 
 * Logs all HTTP requests with method, path, status, duration, etc.
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log request
  logger.request({
    method: req.method,
    url: req.url,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get("user-agent"),
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    
    logger.response(
      {
        method: req.method,
        url: req.url,
        path: req.path,
      },
      {
        statusCode: res.statusCode,
        duration,
      }
    );
  });

  next();
};

