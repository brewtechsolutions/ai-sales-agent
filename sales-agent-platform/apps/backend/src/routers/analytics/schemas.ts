/**
 * Analytics schemas
 */

import { z } from "zod";

export const getOverviewSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getAgentPerformanceSchema = z.object({
  userId: z.string().uuid().optional(), // If not provided, returns all agents
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getProductPerformanceSchema = z.object({
  productId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getRevenueSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
});

export const getLeadDistributionSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type GetOverviewInput = z.infer<typeof getOverviewSchema>;
export type GetAgentPerformanceInput = z.infer<typeof getAgentPerformanceSchema>;
export type GetProductPerformanceInput = z.infer<typeof getProductPerformanceSchema>;
export type GetRevenueInput = z.infer<typeof getRevenueSchema>;
export type GetLeadDistributionInput = z.infer<typeof getLeadDistributionSchema>;

