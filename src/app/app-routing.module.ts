import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'company',
    loadComponent: () => import('./forms/company/company.component').then(m => m.CompanyComponent)
  },
  {
    path: 'machine-process',
    loadChildren: () => import('./modules/machine-management/machine-management.module').then(m => m.MachineManagementModule)
  },
  {
    path: 'users',
    loadComponent: () => import('./forms/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./forms/employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: 'sellers',
    loadComponent: () => import('./forms/sellers/sellers.component').then(m => m.SellersComponent)
  },
  {
    path: 'buyers',
    loadComponent: () => import('./forms/buyers/buyers.component').then(m => m.BuyersComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./forms/products/products.component').then(m => m.ProductsComponent)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
