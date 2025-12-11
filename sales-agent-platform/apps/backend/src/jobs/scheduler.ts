/**
 * Job Scheduler
 * Sets up scheduled jobs using node-cron or similar
 */

import cron from "node-cron";
import { runRLHFBatchJob, runPatternExtractionJob } from "./rlhf-batch";
import { logger } from "../utils/logger";

/**
 * Initialize all scheduled jobs
 */
export function initializeScheduledJobs() {
  // RLHF Batch Learning - Every Sunday at 2 AM
  cron.schedule("0 2 * * 0", async () => {
    logger.info("Running scheduled RLHF batch learning job");
    try {
      await runRLHFBatchJob();
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Scheduled RLHF batch learning job failed", err);
    }
  });

  // Pattern Extraction - Every Sunday at 3 AM
  cron.schedule("0 3 * * 0", async () => {
    logger.info("Running scheduled pattern extraction job");
    try {
      await runPatternExtractionJob();
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Scheduled pattern extraction job failed", err);
    }
  });

  logger.info("Scheduled jobs initialized");
}

/**
 * Start scheduler (call this in index.ts after server starts)
 */
export function startScheduler() {
  if (process.env.NODE_ENV === "production") {
    initializeScheduledJobs();
    logger.info("Job scheduler started");
  } else {
    logger.info("Job scheduler disabled in development mode");
  }
}

