/**
 * User-related constants and enums
 * Following rule: No hardcoded values - use enums or constants
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

