import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { ModuleAccessGuard } from './guards/module-access.guard';

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
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'COMPANY' }
  },
  {
    path: 'machine-process',
    loadChildren: () => import('./modules/machine-management/machine-management.module').then(m => m.MachineManagementModule),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'MACHINE_PROCESS' }
  },
  {
    path: 'employee',
    loadChildren: () => import('./modules/employee-management/employee-management.module').then(m => m.EmployeeManagementModule),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'EMPLOYEES' }
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
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'SELLERS' }
  },
  {
    path: 'buyers',
    loadChildren: () => import('./modules/buyer-management/buyer-management.module').then(m => m.BuyerManagementModule),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'BUYERS' }
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product-management/product-management.module').then(m => m.ProductManagementModule),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'PRODUCTS' }
  },
  {
    path: 'change-password',
    loadComponent: () => import('./forms/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'CHANGE_PASSWORD' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./forms/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard, ModuleAccessGuard],
    data: { moduleKey: 'PROFILE' }
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.component').then(m => m.HelpComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent),
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
