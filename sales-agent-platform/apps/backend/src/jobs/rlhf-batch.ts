/**
 * RLHF Batch Learning Scheduled Job
 * Runs weekly to learn from human agent feedback
 */

import { runRLHFTrainingForAllCompanies } from "../services/rlhf-batch-learning";
import { logger } from "../utils/logger";

/**
 * Run RLHF batch learning for all companies
 * This should be scheduled to run weekly (e.g., every Sunday at 2 AM)
 */
export async function runRLHFBatchJob() {
  logger.info("Starting RLHF batch learning job");

  try {
    await runRLHFTrainingForAllCompanies();
    logger.info("RLHF batch learning job completed successfully");
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("RLHF batch learning job failed", err);
    throw error;
  }
}

/**
 * Run pattern extraction from successful conversations
 * This should be scheduled to run weekly (e.g., every Sunday at 3 AM)
 */
export async function runPatternExtractionJob() {
  logger.info("Starting pattern extraction job");

  try {
    const { learnFromAllSuccessfulConversations } = await import(
      "../services/learn-from-success"
    );
    await learnFromAllSuccessfulConversations();
    logger.info("Pattern extraction job completed successfully");
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Pattern extraction job failed", err);
    throw error;
  }
}

