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
  isLoggedIn:boolean=localStorage.getItem('isLoggedIn') === 'true';
  user: any = [];
  constructor(
    private loginService: LoginService,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.loginService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.getUserDetails();
  }

  onUserLoggedIn() {
    console.log("LOGIN EMITTED");
  }

  logout() {
    this.loginService.logout();
  }

  getUserDetails() {
    this.user.name = 'John Doe';
    this.user.email = 'johncalabe@yahoo.in';
    this.user.phone = '+1 234 567 8901';
    this.user.address = '123 Main St, Anytown, USA';
    this.user.employeeCode = 'EMP001';
    this.user.photoURL = 'assets/images/default-avatar.jpg'
    // return this.loginService.getUserDetails();
  }

  navigateTo(page: string) {
    console.log('Navigating to:', page);
    this.menuController.close('rightMenu').then(() => {
      this.router.navigate([`/${page}`]);
    }).catch(err => {
      console.error('Menu close error:', err);
    });
  }
}
