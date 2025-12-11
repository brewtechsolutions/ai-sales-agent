/**
 * AI router schemas
 */

import { z } from "zod";

export const getSuggestionSchema = z.object({
  conversationId: z.string().uuid(),
});

export const rateSuggestionSchema = z.object({
  suggestionId: z.string().uuid(),
  rating: z.number().min(1).max(5),
});

export const useSuggestionSchema = z.object({
  suggestionId: z.string().uuid(),
  modifiedMessage: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type GetSuggestionInput = z.infer<typeof getSuggestionSchema>;
export type RateSuggestionInput = z.infer<typeof rateSuggestionSchema>;
export type UseSuggestionInput = z.infer<typeof useSuggestionSchema>;

