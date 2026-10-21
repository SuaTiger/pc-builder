import type { Build, CompatibilityReport } from './compatibility';
import type { PartSpecByCategory } from './part-specs';
import type { Permission, UserRole } from './auth';
import type { PartCategory } from './parts';

/*
 * Request and response shapes of the API, shared so client and server can never disagree.
 */

/** Body of POST /api/builds/check. The client sends only ids; the server looks up the specs. */
export interface BuildSelection {
  cpuId?: string;
  motherboardId?: string;
  ramId?: string;
  gpuId?: string;
  /** A drive may appear more than once if the user wants two of the same model. */
  storageIds?: string[];
  psuId?: string;
  caseId?: string;
  coolerId?: string;
}

/** Response of GET /api/parts/:category. */
export interface PartsResponse<C extends PartCategory = PartCategory> {
  category: C;
  parts: PartSpecByCategory[C][];
}

/** Response of POST /api/builds/check. */
export interface CheckBuildResponse {
  /** The full specs the server found for the selected ids. */
  build: Build;
  report: CompatibilityReport;
  totalPriceThb: number;
  /** 0 until a CPU or GPU is selected. */
  estimatedWatts: number;
}

/** Shape of every error response. */
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

/** Response shape of GET /api/health. */
export interface HealthResponse {
  status: 'ok';
  uptimeSeconds: number;
  timestamp: string;
}

/** An id the client sent that does not exist in the database. */
export interface MissingPart {
  category: PartCategory;
  id: string;
}

/** Response of GET /api/me. */
export interface MeResponse {
  id: string;
  email: string | null;
  role: UserRole;
  permissions: Permission[];
}

/** Body of POST and PUT /api/me/builds. */
export interface SaveBuildRequest {
  name: string;
  selection: BuildSelection;
}

export interface SavedBuildSummary {
  id: string;
  name: string;
  selection: BuildSelection;
  createdAt: string;
  updatedAt: string;
}

/** Response of GET /api/me/builds. */
export interface SavedBuildsResponse {
  builds: SavedBuildSummary[];
}

/** A saved build with its parts loaded and its compatibility freshly checked. */
export interface SavedBuildDetail extends SavedBuildSummary, CheckBuildResponse {
  /** Parts the build refers to that no longer exist (e.g. removed from the catalogue). */
  missingParts: MissingPart[];
}

export interface UserSummary {
  id: string;
  email: string | null;
  role: UserRole;
  createdAt: string;
}

/** Response of GET /api/admin/users. */
export interface UsersResponse {
  users: UserSummary[];
}

/** Body of PATCH /api/admin/users/:id/role. */
export interface SetRoleRequest {
  role: UserRole;
}
