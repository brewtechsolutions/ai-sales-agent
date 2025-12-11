/**
 * Conversation-related constants and enums
 */

export enum ConversationStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  WAITING = "waiting",
  COMPLETED = "completed",
  LOST = "lost",
}

export enum LeadStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  QUALIFIED = "Qualified",
  PROPOSAL_SENT = "Proposal Sent",
  NEGOTIATION = "Negotiation",
  WON = "Won",
  LOST = "Lost",
}

export enum BehaviorScoreColor {
  GREEN = "green", // 80-100 points (Hot Lead)
  YELLOW = "yellow", // 50-79 points (Warm Lead)
  RED = "red", // 0-49 points (Cold Lead)
}

export const BEHAVIOR_SCORE_THRESHOLDS = {
  HOT_LEAD: 80,
  WARM_LEAD: 50,
  COLD_LEAD: 0,
} as const;

