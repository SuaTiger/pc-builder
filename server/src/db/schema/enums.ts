import { pgEnum } from 'drizzle-orm/pg-core';
import {
  MEMORY_TYPES,
  MOTHERBOARD_FORM_FACTORS,
  PSU_FORM_FACTORS,
  SOCKETS,
  STORAGE_INTERFACES,
  USER_ROLES,
} from '@pc-builder/shared';

// The allowed values come from the shared package, so the database, the API
// and the UI can never disagree about what a valid socket (etc.) is.
export const socketEnum = pgEnum('socket', SOCKETS);
export const memoryTypeEnum = pgEnum('memory_type', MEMORY_TYPES);
export const motherboardFormFactorEnum = pgEnum(
  'motherboard_form_factor',
  MOTHERBOARD_FORM_FACTORS,
);
export const psuFormFactorEnum = pgEnum('psu_form_factor', PSU_FORM_FACTORS);
export const storageInterfaceEnum = pgEnum('storage_interface', STORAGE_INTERFACES);
export const userRoleEnum = pgEnum('user_role', USER_ROLES);
