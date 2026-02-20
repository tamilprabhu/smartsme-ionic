import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AppModuleKey, canAccessAnyModule, canAccessModule } from '../utils/module-access.util';

interface ModuleAccessData {
  moduleKey?: AppModuleKey;
  anyModuleKeys?: AppModuleKey[];
}

@Injectable({
  providedIn: 'root'
})
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const userRoles = this.loginService.getUserRoles();
    const data = route.data as ModuleAccessData;

    if (data.moduleKey && canAccessModule(userRoles, data.moduleKey)) {
      return true;
    }

    if (Array.isArray(data.anyModuleKeys) && canAccessAnyModule(userRoles, data.anyModuleKeys)) {
      return true;
    }

    return this.router.createUrlTree(['/tabs/home']);
  }
}
