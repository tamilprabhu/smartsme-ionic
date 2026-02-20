import { extractRoleNames } from './role-access.util';

export const ALL_MODULES = 'ALL' as const;

export const APP_ROLES = [
  'ACCOUNTANT',
  'ADMIN',
  'OWNER',
  'PLANT_HEAD',
  'PRODUCTION_EMPLOYEE',
  'SECONDARY_PROCESS_EMPLOYEE',
  'SHIFT_INCHARGE',
  'SMARTSME_ADMIN',
  'SMARTSME_SUPPORT',
  'STORES_INCHARGE'
] as const;

export type AppRole = typeof APP_ROLES[number];

export type AppModuleKey =
  | 'PROFILE'
  | 'CHANGE_PASSWORD'
  | 'REPORTS'
  | 'PROFILE_MASTERS'
  | 'COMPANY'
  | 'MACHINE_PROCESS'
  | 'EMPLOYEES'
  | 'SELLERS'
  | 'BUYERS'
  | 'PRODUCTS'
  | 'STOCK_INWARD'
  | 'ORDER'
  | 'INVOICE'
  | 'DISPATCH'
  | 'PRODUCTION_SHIFT';

export type RoleModulePermission = readonly AppModuleKey[] | typeof ALL_MODULES;

export const MODULES_FOR_ALL_ROLES: readonly AppModuleKey[] = [
  'PROFILE',
  'CHANGE_PASSWORD',
  'REPORTS'
];

// Initial deployment permissions.
// TODO: Replace this hardcoded map with backend-driven permissions.
export const ROLE_MODULE_PERMISSIONS: Readonly<Record<AppRole, RoleModulePermission>> = {
  ACCOUNTANT: MODULES_FOR_ALL_ROLES,
  ADMIN: ALL_MODULES,
  OWNER: ALL_MODULES,
  PLANT_HEAD: MODULES_FOR_ALL_ROLES,
  PRODUCTION_EMPLOYEE: [...MODULES_FOR_ALL_ROLES, 'PRODUCTION_SHIFT'],
  SECONDARY_PROCESS_EMPLOYEE: MODULES_FOR_ALL_ROLES,
  SHIFT_INCHARGE: MODULES_FOR_ALL_ROLES,
  SMARTSME_ADMIN: ALL_MODULES,
  SMARTSME_SUPPORT: ALL_MODULES,
  STORES_INCHARGE: MODULES_FOR_ALL_ROLES
};

function getRolePermission(role: string): RoleModulePermission | undefined {
  const normalizedRole = role.toUpperCase() as AppRole;
  return ROLE_MODULE_PERMISSIONS[normalizedRole];
}

export function getPermittedModules(userRoles: string[]): Set<AppModuleKey> | typeof ALL_MODULES {
  const normalizedUserRoles = extractRoleNames(userRoles);
  const permittedModules = new Set<AppModuleKey>();

  for (const role of normalizedUserRoles) {
    const rolePermission = getRolePermission(role);
    if (!rolePermission) {
      continue;
    }

    if (rolePermission === ALL_MODULES) {
      return ALL_MODULES;
    }

    rolePermission.forEach((moduleKey) => permittedModules.add(moduleKey));
  }

  return permittedModules;
}

export function canAccessModule(userRoles: string[], moduleKey: AppModuleKey): boolean {
  const permittedModules = getPermittedModules(userRoles);
  if (permittedModules === ALL_MODULES) {
    return true;
  }

  return permittedModules.has(moduleKey);
}

export function canAccessAnyModule(userRoles: string[], moduleKeys: readonly AppModuleKey[]): boolean {
  return moduleKeys.some((moduleKey) => canAccessModule(userRoles, moduleKey));
}
