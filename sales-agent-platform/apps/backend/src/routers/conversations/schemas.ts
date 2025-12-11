/**
 * Conversation schemas and DTOs
 */

import { z } from "zod";
import { ConversationStatus } from "../../constants/conversation";

export const assignConversationSchema = z.object({
  conversationId: z.string().uuid(),
  userId: z.string().uuid(),
  reason: z.string().optional(),
});

export const reassignConversationSchema = z.object({
  conversationId: z.string().uuid(),
  newUserId: z.string().uuid(),
  reason: z.string().optional(),
});

export const listConversationsSchema = z.object({
  status: z.nativeEnum(ConversationStatus).optional(),
  assignedTo: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export const markCompleteSchema = z.object({
  conversationId: z.string().uuid(),
  status: z.enum(["completed", "lost"]),
  saleAmount: z.number().optional(),
  productsSold: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ).optional(),
  notes: z.string().optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1),
  wasAISuggestionAvailable: z.boolean().optional(),
});

export const addNoteSchema = z.object({
  conversationId: z.string().uuid(),
  note: z.string().min(1),
});

export type AssignConversationInput = z.infer<typeof assignConversationSchema>;
export type ReassignConversationInput = z.infer<typeof reassignConversationSchema>;
export type ListConversationsInput = z.infer<typeof listConversationsSchema>;
export type MarkCompleteInput = z.infer<typeof markCompleteSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;

