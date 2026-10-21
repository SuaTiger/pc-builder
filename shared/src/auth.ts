/*
 * Roles and permissions.
 * Code checks PERMISSIONS ("can this user do X?"), never roles ("is this user an admin?").
 * That way a new role is one new row in ROLE_PERMISSIONS and no route needs to change.
 */

export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PERMISSIONS = ['build:manage-own', 'user:manage'] as const;
export type Permission = (typeof PERMISSIONS)[number];

/** `Record<UserRole, ...>` makes TypeScript demand an entry here whenever a role is added. */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  user: ['build:manage-own'],
  admin: ['build:manage-own', 'user:manage'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** The logged-in user as the API sees them on every authenticated request. */
export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole;
}
