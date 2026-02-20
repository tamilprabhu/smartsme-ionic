export type RoleValue = string | { name?: string | null } | null | undefined;

export const DEFAULT_ADMIN_ROLES = ['ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'] as const;

function normalizeRole(role: string): string {
  return role.trim().toUpperCase();
}

export function extractRoleNames(roles: RoleValue[]): string[] {
  const names = roles
    .map((role) => {
      if (typeof role === 'string') {
        return role;
      }
      return role?.name ?? '';
    })
    .map(normalizeRole)
    .filter(Boolean);

  return Array.from(new Set(names));
}

export function hasRole(userRoles: string[], requiredRole: string): boolean {
  const normalizedUserRoles = extractRoleNames(userRoles);
  const normalizedRequiredRole = normalizeRole(requiredRole);
  return normalizedUserRoles.includes(normalizedRequiredRole);
}

export function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  const normalizedUserRoles = extractRoleNames(userRoles);
  const normalizedRequiredRoles = extractRoleNames(requiredRoles);

  return normalizedRequiredRoles.some((role) => normalizedUserRoles.includes(role));
}

export function hasAllRoles(userRoles: string[], requiredRoles: string[]): boolean {
  const normalizedUserRoles = extractRoleNames(userRoles);
  const normalizedRequiredRoles = extractRoleNames(requiredRoles);

  return normalizedRequiredRoles.every((role) => normalizedUserRoles.includes(role));
}

export function isAdmin(
  userRoles: string[],
  adminRoles: readonly string[] = DEFAULT_ADMIN_ROLES
): boolean {
  return hasAnyRole(userRoles, [...adminRoles]);
}

export function canAccess(
  userRoles: string[],
  requiredRoles: string[],
  adminRoles: readonly string[] = DEFAULT_ADMIN_ROLES
): boolean {
  return isAdmin(userRoles, adminRoles) || hasAnyRole(userRoles, requiredRoles);
}

export function getRolesFromDecodedToken(decoded: { roles?: unknown } | null | undefined): string[] {
  if (!Array.isArray(decoded?.roles)) {
    return [];
  }

  return extractRoleNames(decoded.roles as RoleValue[]);
}

export function getRolesFromStoredUser(rawUser: string | null): string[] {
  if (!rawUser) {
    return [];
  }

  try {
    const user = JSON.parse(rawUser);
    if (!Array.isArray(user?.roles)) {
      return [];
    }
    return extractRoleNames(user.roles as RoleValue[]);
  } catch {
    return [];
  }
}
