import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavigationItem {
  title: string;
  subtitle: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-profile-masters',
  templateUrl: './profile-masters.page.html',
  styleUrls: ['./profile-masters.page.scss'],
  standalone: false
})
export class ProfileMastersPage {
  profileItems: NavigationItem[] = [
    {
      title: 'Profile',
      subtitle: 'View and update account details',
      icon: 'person-circle-outline',
      route: '/profile'
    },
    {
      title: 'Change Password',
      subtitle: 'Update login credentials',
      icon: 'lock-closed-outline',
      route: '/change-password'
    }
  ];

  masterItems: NavigationItem[] = [
    {
      title: 'Company',
      subtitle: 'Manage company master records',
      icon: 'business-outline',
      route: '/company'
    },
    {
      title: 'Machine Process',
      subtitle: 'Manage machine details and process setup',
      icon: 'construct-outline',
      route: '/machine-process'
    },
    {
      title: 'Employees',
      subtitle: 'Manage employee accounts and roles',
      icon: 'people-outline',
      route: '/employee/list'
    },
    {
      title: 'Sellers',
      subtitle: 'Maintain seller master data',
      icon: 'storefront-outline',
      route: '/sellers'
    },
    {
      title: 'Buyers',
      subtitle: 'Maintain buyer master data',
      icon: 'cart-outline',
      route: '/buyers'
    },
    {
      title: 'Products',
      subtitle: 'Maintain product master data',
      icon: 'cube-outline',
      route: '/products'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigateByUrl(route).catch((error) => console.error('Navigation error:', error));
  }
}
