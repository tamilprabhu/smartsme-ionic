import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.loginService.isAuthenticated()) {
      return this.router.createUrlTree(['/tabs']);
    }
    return true;
  }
}
