/**
 * Conversations router
 * Handles conversation assignment, messaging, and management
 */

import { z } from "zod";
import { router } from "../../trpc/trpc";
import { companyProcedure } from "../../trpc/trpc";
import { requireCompanyAdmin, requireCompanyUser } from "../../middleware/role-based-access";
import {
  assignConversationSchema,
  reassignConversationSchema,
  listConversationsSchema,
  markCompleteSchema,
  sendMessageSchema,
  addNoteSchema,
} from "./schemas";
import { conversationService } from "./services";
import { USER_ROLES } from "../../constants/user";

const adminProcedure = companyProcedure.use(requireCompanyAdmin);
const agentProcedure = companyProcedure.use(requireCompanyUser);

export const conversationsRouter = router({
  /**
   * List conversations (filtered by role)
   */
  list: companyProcedure
    .input(listConversationsSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id || !ctx.user?.role) {
        throw new Error("Company ID, User ID, and Role required");
      }
      return conversationService.list(input, ctx.user.id, ctx.user.role, ctx.companyId);
    }),

  /**
   * Get conversation by ID
   */
  getById: companyProcedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id || !ctx.user?.role) {
        throw new Error("Company ID, User ID, and Role required");
      }
      return conversationService.getById(input.conversationId, ctx.user.id, ctx.user.role, ctx.companyId);
    }),

  /**
   * List unassigned conversations (admin only)
   */
  listUnassigned: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.companyId) {
      throw new Error("Company ID required");
    }
    return conversationService.listUnassigned(ctx.companyId);
  }),

  /**
   * Assign conversation to user (admin only)
   */
  assign: adminProcedure
    .input(assignConversationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return conversationService.assign(input, ctx.user.id, ctx.companyId);
    }),

  /**
   * Reassign conversation (admin only)
   */
  reassign: adminProcedure
    .input(reassignConversationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return conversationService.reassign(input, ctx.user.id, ctx.companyId);
    }),

  /**
   * Send message (agent or admin)
   */
  sendMessage: companyProcedure
    .input(sendMessageSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id || !ctx.user?.role) {
        throw new Error("Company ID, User ID, and Role required");
      }
      return conversationService.sendMessage(input, ctx.user.id, ctx.user.role, ctx.companyId);
    }),

  /**
   * Mark conversation as completed/lost (agent only)
   */
  markComplete: agentProcedure
    .input(markCompleteSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id) {
        throw new Error("Company ID and User ID required");
      }
      return conversationService.markComplete(input, ctx.user.id, ctx.companyId);
    }),

  /**
   * Add internal note (agent or admin)
   */
  addNote: companyProcedure
    .input(addNoteSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId || !ctx.user?.id || !ctx.user?.role) {
        throw new Error("Company ID, User ID, and Role required");
      }
      return conversationService.addNote(input, ctx.user.id, ctx.user.role, ctx.companyId);
    }),
});

