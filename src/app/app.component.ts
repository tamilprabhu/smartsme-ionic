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
      this.menuController.enable(status, 'rightMenu');
    });

    this.loginService.currentUser$.subscribe(user => {
      this.user = user;
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
