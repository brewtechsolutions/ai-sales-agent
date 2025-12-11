/**
 * Analytics router (Company Admin only)
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin } from "../../middleware/role-based-access";
import {
  getOverviewSchema,
  getAgentPerformanceSchema,
  getProductPerformanceSchema,
  getRevenueSchema,
  getLeadDistributionSchema,
} from "./schemas";
import { analyticsService } from "./services";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);

export const analyticsRouter = router({
  /**
   * Get company overview metrics
   */
  getOverview: adminProcedure
    .input(getOverviewSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return analyticsService.getOverview(input, ctx.companyId);
    }),

  /**
   * Get agent performance metrics
   */
  getAgentPerformance: adminProcedure
    .input(getAgentPerformanceSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return analyticsService.getAgentPerformance(input, ctx.companyId);
    }),

  /**
   * Get product performance metrics
   */
  getProductPerformance: adminProcedure
    .input(getProductPerformanceSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return analyticsService.getProductPerformance(input, ctx.companyId);
    }),

  /**
   * Get revenue metrics
   */
  getRevenue: adminProcedure
    .input(getRevenueSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return analyticsService.getRevenue(input, ctx.companyId);
    }),

  /**
   * Get lead distribution (green/yellow/red)
   */
  getLeadDistribution: adminProcedure
    .input(getLeadDistributionSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new Error("Company ID required");
      }
      return analyticsService.getLeadDistribution(input, ctx.companyId);
    }),
});

