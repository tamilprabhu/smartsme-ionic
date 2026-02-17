import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./guest/home/guest-home.component').then(m => m.GuestHomeComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./guest/signup/guest-signup.component').then(m => m.GuestSignupComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'about',
    loadComponent: () => import('./guest/about/guest-about.component').then(m => m.GuestAboutComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./guest/contact/guest-contact.component').then(m => m.GuestContactComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'company',
    loadChildren: () => import('./modules/company-management/company-management.module').then(m => m.CompanyManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'machine-process',
    loadChildren: () => import('./modules/machine-management/machine-management.module').then(m => m.MachineManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee-management/employee-management.module').then(m => m.EmployeeManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'employees',
    redirectTo: 'employee/list',
    pathMatch: 'full',
  },
  {
    path: 'users',
    redirectTo: 'employee/list',
    pathMatch: 'full',
  },
  {
    path: 'sellers',
    loadChildren: () => import('./modules/seller-management/seller-management.module').then(m => m.SellerManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'buyers',
    loadChildren: () => import('./modules/buyer-management/buyer-management.module').then(m => m.BuyerManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product-management/product-management.module').then(m => m.ProductManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    loadComponent: () => import('./forms/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./forms/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
