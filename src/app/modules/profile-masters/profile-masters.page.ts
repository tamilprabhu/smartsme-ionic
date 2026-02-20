import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { AppModuleKey, canAccessModule } from 'src/app/utils/module-access.util';

interface NavigationItem {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  moduleKey: AppModuleKey;
}

@Component({
  selector: 'app-profile-masters',
  templateUrl: './profile-masters.page.html',
  styleUrls: ['./profile-masters.page.scss'],
  standalone: false
})
export class ProfileMastersPage {
  profileItems: NavigationItem[] = [];
  masterItems: NavigationItem[] = [];

  get pageTitle(): string {
    return this.masterItems.length > 0 ? 'Profile & Masters' : 'Profile';
  }

  private readonly allProfileItems: NavigationItem[] = [
    {
      title: 'Profile',
      subtitle: 'View and update account details',
      icon: 'person-circle-outline',
      route: '/profile',
      moduleKey: 'PROFILE'
    },
    {
      title: 'Change Password',
      subtitle: 'Update login credentials',
      icon: 'lock-closed-outline',
      route: '/change-password',
      moduleKey: 'CHANGE_PASSWORD'
    }
  ];

  private readonly allMasterItems: NavigationItem[] = [
    {
      title: 'Company',
      subtitle: 'Manage company master records',
      icon: 'business-outline',
      route: '/company',
      moduleKey: 'COMPANY'
    },
    {
      title: 'Machine Process',
      subtitle: 'Manage machine details and process setup',
      icon: 'construct-outline',
      route: '/machine-process',
      moduleKey: 'MACHINE_PROCESS'
    },
    {
      title: 'Employees',
      subtitle: 'Manage employee accounts and roles',
      icon: 'people-outline',
      route: '/employee/list',
      moduleKey: 'EMPLOYEES'
    },
    {
      title: 'Sellers',
      subtitle: 'Maintain seller master data',
      icon: 'storefront-outline',
      route: '/sellers',
      moduleKey: 'SELLERS'
    },
    {
      title: 'Buyers',
      subtitle: 'Maintain buyer master data',
      icon: 'cart-outline',
      route: '/buyers',
      moduleKey: 'BUYERS'
    },
    {
      title: 'Products',
      subtitle: 'Maintain product master data',
      icon: 'cube-outline',
      route: '/products',
      moduleKey: 'PRODUCTS'
    }
  ];

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const userRoles = this.loginService.getUserRoles();
    this.profileItems = this.allProfileItems.filter((item) => canAccessModule(userRoles, item.moduleKey));
    this.masterItems = this.allMasterItems.filter((item) => canAccessModule(userRoles, item.moduleKey));
  }

  goBack(): void {
    this.router.navigate(['/tabs/home']);
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route).catch((error) => console.error('Navigation error:', error));
  }
}
