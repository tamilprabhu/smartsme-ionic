import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.loginService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.loginService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onUserLoggedIn() {
    console.log("User logged in successfully");
  }

  logout() {
    this.loginService.logout();
    this.menuController.close('rightMenu');
  }

  navigateTo(page: string) {
    console.log('Navigating to:', page);
    this.menuController.close('rightMenu').then(() => {
      const normalized = page.replace(/^\//, '');
      const route = this.router.config.find(r => r.path === normalized);

      if (!route) {
        console.warn(`Route not found for "${page}", navigating anyway`);
        this.router.navigate([`/${normalized}`]).catch(err => console.error('Navigation error:', err));
        return;
      }

      if ((route as any).loadChildren) {
        // lazy-loaded module
        this.router.navigateByUrl(`/${normalized}`).catch(err => console.error('Navigation error:', err));
      } else {
        // component route (or regular route)
        this.router.navigate([`/${normalized}`]).catch(err => console.error('Navigation error:', err));
      }
    }).catch(err => {
      console.error('Menu close error:', err);
    });
  }
}
