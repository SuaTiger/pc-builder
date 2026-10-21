import { describe, expect, it } from 'vitest';
import { hasPermission, PERMISSIONS, ROLE_PERMISSIONS, USER_ROLES } from './auth';

describe('hasPermission', () => {
  it('lets a normal user manage their own builds but not other users', () => {
    expect(hasPermission('user', 'build:manage-own')).toBe(true);
    expect(hasPermission('user', 'user:manage')).toBe(false);
  });

  it('lets an admin do everything', () => {
    for (const permission of PERMISSIONS) {
      expect(hasPermission('admin', permission)).toBe(true);
    }
  });

  it('gives every permission to at least one role, so none is dead', () => {
    for (const permission of PERMISSIONS) {
      const granted = USER_ROLES.some((role) => ROLE_PERMISSIONS[role].includes(permission));
      expect(granted).toBe(true);
    }
  });
});
