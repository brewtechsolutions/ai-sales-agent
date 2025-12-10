/**
 * Logger Utility
 * 
 * Simple logger with different log levels and formatting.
 * Can be easily upgraded to winston/pino later if needed.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    // Get log level from env, default to 'info' in production, 'debug' in development
    const envLogLevel = (process.env.LOG_LEVEL || "").toLowerCase() as LogLevel;
    const validLevels: LogLevel[] = ["debug", "info", "warn", "error"];
    
    this.logLevel = validLevels.includes(envLogLevel) 
      ? envLogLevel 
      : process.env.NODE_ENV === "production" 
        ? "info" 
        : "debug";
    
    this.isDevelopment = process.env.NODE_ENV !== "production";
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data, error } = entry;
    
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      logMessage += ` ${JSON.stringify(data)}`;
    }
    
    if (error) {
      logMessage += `\nError: ${error.message}`;
      if (error.stack && this.isDevelopment) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private log(level: LogLevel, message: string, data?: Record<string, any>, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case "debug":
        console.debug(formatted);
        break;
      case "info":
        console.info(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        break;
    }
  }

  debug(message: string, data?: Record<string, any>) {
    this.log("debug", message, data);
  }

  info(message: string, data?: Record<string, any>) {
    this.log("info", message, data);
  }

  warn(message: string, data?: Record<string, any>) {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error, data?: Record<string, any>) {
    this.log("error", message, data, error);
  }

  /**
   * Log HTTP request
   */
  request(req: {
    method: string;
    url: string;
    path?: string;
    ip?: string;
    userAgent?: string;
  }) {
    this.info("HTTP Request", {
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip,
      userAgent: req.userAgent,
    });
  }

  /**
   * Log HTTP response
   */
  response(req: {
    method: string;
    url: string;
    path?: string;
  }, res: {
    statusCode: number;
    duration?: number;
  }) {
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    
    this.log(level, "HTTP Response", {
      method: req.method,
      url: req.url,
      path: req.path,
      statusCode: res.statusCode,
      duration: res.duration ? `${res.duration}ms` : undefined,
    });
  }

  /**
   * Log tRPC procedure call
   */
  trpc(procedure: string, input?: any, userId?: string) {
    this.debug("tRPC Procedure Call", {
      procedure,
      input: this.isDevelopment ? input : undefined, // Only log input in dev
      userId,
    });
  }

  /**
   * Log tRPC procedure result
   */
  trpcResult(procedure: string, success: boolean, duration?: number, error?: Error) {
    const level = success ? "info" : "error";
    this.log(level, "tRPC Procedure Result", {
      procedure,
      success,
      duration: duration ? `${duration}ms` : undefined,
    }, error);
  }
}

// Export singleton instance
export const logger = new Logger();

