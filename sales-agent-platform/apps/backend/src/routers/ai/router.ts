/**
 * AI router (for agents to get suggestions)
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { getSuggestionSchema, rateSuggestionSchema, useSuggestionSchema } from "./schemas";
import { aiService } from "./services";

export const aiRouter = router({
  /**
   * Get AI suggestion for conversation
   */
  getSuggestion: companyProcedure
    .input(getSuggestionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User ID required");
      }
      return aiService.getSuggestion(input.conversationId, ctx.user.id);
    }),

  /**
   * Rate AI suggestion
   */
  rateSuggestion: companyProcedure
    .input(rateSuggestionSchema)
    .mutation(async ({ input }) => {
      return aiService.rateSuggestion(input);
    }),

  /**
   * Use AI suggestion (send message)
   */
  useSuggestion: companyProcedure
    .input(useSuggestionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new Error("User ID required");
      }
      return aiService.useSuggestion(input, ctx.user.id);
    }),
});

