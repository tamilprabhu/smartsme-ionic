import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./modules/company-management/company-management.module').then(m => m.CompanyManagementModule)
  },
  {
    path: 'machine-process',
    loadChildren: () => import('./modules/machine-management/machine-management.module').then(m => m.MachineManagementModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule)
  },
  {
    path: 'employees',
    loadComponent: () => import('./forms/employee/employee.component').then(m => m.EmployeeComponent)
  },
  {
    path: 'sellers',
    loadChildren: () => import('./modules/seller-management/seller-management.module').then(m => m.SellerManagementModule)
  },
  {
    path: 'buyers',
    loadChildren: () => import('./modules/buyer-management/buyer-management.module').then(m => m.BuyerManagementModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product-management/product-management.module').then(m => m.ProductManagementModule)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./forms/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./forms/profile/profile.component').then(m => m.ProfileComponent)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
