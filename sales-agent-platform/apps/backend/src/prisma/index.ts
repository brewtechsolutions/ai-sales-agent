import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Helper function to get primary role from roles array
 * Always use roles[0] as the primary role
 * 
 * IMPORTANT: roles is the SOURCE OF TRUTH
 * role field is auto-computed from roles[0] for backward compatibility and indexing
 */
export function getPrimaryRole(roles: any): string {
  if (Array.isArray(roles) && roles.length > 0) {
    return roles[0];
  }
  // Fallback for legacy data
  return "company_user";
}

/**
 * Helper function to prepare user data with auto-synced role
 * Always use this when creating/updating users to ensure role = roles[0]
 */
export function prepareUserData(data: Prisma.UserCreateInput | Prisma.UserUpdateInput): any {
  const prepared = { ...data };
  
  // If roles is being set, auto-sync role from roles[0]
  if ('roles' in prepared && prepared.roles !== undefined) {
    const roles = Array.isArray(prepared.roles) ? prepared.roles : [];
    (prepared as any).role = getPrimaryRole(roles);
  }
  
  return prepared;
}

export const prisma = new PrismaClient();
