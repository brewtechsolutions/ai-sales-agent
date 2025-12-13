/**
 * User-related constants and enums
 * Following rule: No hardcoded values - use enums or constants
 * 
 * IMPORTANT: Role Management
 * - `roles` (array) is the SOURCE OF TRUTH: ["super_admin", "company_admin", "company_user"]
 * - `role` (string) is auto-computed from roles[0] for backward compatibility and database indexing
 * - Always set/update `roles` array, never set `role` directly
 * - Use `prepareUserData()` helper when creating/updating users to auto-sync role
 */

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  COMPANY_ADMIN: "company_admin",
  COMPANY_USER: "company_user",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

