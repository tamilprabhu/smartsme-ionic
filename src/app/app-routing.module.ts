import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'company',
    loadComponent: () => import('./components/company/company.component').then(m => m.CompanyComponent)
  },
  {
    path: 'machine-process',
    loadComponent: () => import('./modules/machine-process/machine-process.component').then(m => m.MachineProcessComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./modules/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./modules/employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: 'sellers',
    loadComponent: () => import('./modules/sellers/sellers.component').then(m => m.SellersComponent)
  },
  {
    path: 'buyers',
    loadComponent: () => import('./modules/buyers/buyers.component').then(m => m.BuyersComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./modules/products/products.component').then(m => m.ProductsComponent)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
