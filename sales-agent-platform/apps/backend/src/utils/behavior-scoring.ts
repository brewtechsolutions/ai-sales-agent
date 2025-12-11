/**
 * Behavior scoring utilities for lead qualification
 */

import { BehaviorScoreColor, BEHAVIOR_SCORE_THRESHOLDS } from "../constants/conversation";

/**
 * Calculate behavior score based on messages and engagement
 */
export function calculateBehaviorScore(
  _contact: { totalMessages: number },
  recentMessages: Array<{ content: string; timestamp: Date; senderType: string }>
): number {
  let score = 50; // start neutral

  if (!recentMessages || recentMessages.length === 0) {
    return score;
  }

  const recentContent = recentMessages
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // High intent keywords (+20 each, max 40)
  const highIntentKeywords = ["buy", "purchase", "order", "payment", "checkout"];
  const intentMatches = highIntentKeywords.filter((keyword) =>
    recentContent.includes(keyword)
  ).length;
  score += Math.min(intentMatches * 20, 40);

  // Price inquiries (+15)
  if (
    recentContent.includes("price") ||
    recentContent.includes("cost") ||
    recentContent.includes("how much")
  ) {
    score += 15;
  }

  // Product-specific questions (+15)
  if (recentContent.match(/what.*about|tell.*more|details|specifications/)) {
    score += 15;
  }

  // Fast response time (+10)
  const avgResponseTime = calculateAvgResponseTime(recentMessages);
  if (avgResponseTime < 300) {
    score += 10; // under 5 minutes
  }

  // High engagement (+10)
  if (recentMessages.length >= 8) {
    score += 10;
  }

  // Positive sentiment (+10)
  const positive = ["great", "excellent", "perfect", "yes", "interested", "love"];
  if (positive.some((w) => recentContent.includes(w))) {
    score += 10;
  }

  // Negative signals
  const objections = ["expensive", "too much", "not interested", "maybe later"];
  if (objections.some((w) => recentContent.includes(w))) {
    score -= 15;
  }

  // Slow response (-10)
  if (avgResponseTime > 3600) {
    score -= 10; // over 1 hour
  }

  // Clamp between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get score color based on behavior score
 */
export function getScoreColor(score: number): BehaviorScoreColor {
  if (score >= BEHAVIOR_SCORE_THRESHOLDS.HOT_LEAD) {
    return BehaviorScoreColor.GREEN;
  }
  if (score >= BEHAVIOR_SCORE_THRESHOLDS.WARM_LEAD) {
    return BehaviorScoreColor.YELLOW;
  }
  return BehaviorScoreColor.RED;
}

/**
 * Calculate average response time in seconds
 */
function calculateAvgResponseTime(
  messages: Array<{ timestamp: Date; senderType: string }>
): number {
  const customerMessages = messages.filter((m) => m.senderType === "contact");

  if (customerMessages.length < 2) {
    return 600; // default 10 minutes
  }

  let totalTime = 0;
  for (let i = 1; i < customerMessages.length; i++) {
    const diff =
      customerMessages[i - 1].timestamp.getTime() -
      customerMessages[i].timestamp.getTime();
    totalTime += Math.abs(diff) / 1000; // convert to seconds
  }

  return totalTime / (customerMessages.length - 1);
}

