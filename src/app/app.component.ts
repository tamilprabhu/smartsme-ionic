import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { canAccessAnyModule } from './utils/module-access.util';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
  providers: [LoginService]
})
export class AppComponent {
  isLoggedIn: boolean = false;
  user: any = null;
  profileMenuLabel = 'Profile';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.loginService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.menuController.enable(status, 'rightMenu');
    });

    this.loginService.currentUser$.subscribe(user => {
      this.user = user;
      const userRoles = this.loginService.getUserRoles();
      const hasMasterAccess = canAccessAnyModule(userRoles, [
        'COMPANY',
        'MACHINE_PROCESS',
        'EMPLOYEES',
        'SELLERS',
        'BUYERS',
        'PRODUCTS'
      ]);
      this.profileMenuLabel = hasMasterAccess ? 'Profile & Masters' : 'Profile';
    });
  }

  logout() {
    this.loginService.logout();
    this.menuController.close('rightMenu').finally(() => {
      this.router.navigate(['/home']).catch(() => this.router.navigate(['/']));
    });
  }

  navigateTo(page: string) {
    console.log('Navigating to:', page);
    this.menuController.close('rightMenu').then(() => {
      const targetRoute = page.startsWith('/') ? page : `/${page}`;
      this.router.navigateByUrl(targetRoute).catch(err => console.error('Navigation error:', err));
    }).catch(err => {
      console.error('Menu close error:', err);
    });
  }
}
