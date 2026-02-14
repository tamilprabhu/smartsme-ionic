import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'operations',
        loadChildren: () => import('../operations/operations.module').then(m => m.OperationsPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: 'production-shift',
        loadChildren: () => import('../production-shift/production-shift.module').then(m => m.ProductionShiftModule)
      },
      {
        path: 'dispatch-management',
        loadChildren: () => import('../dispatch-management/dispatch-management.module').then(m => m.DispatchManagementModule)
      },
      {
        path: 'stock-management',
        loadChildren: () => import('../stock-management/stock-management.module').then(m => m.StockManagementModule)
      },
      {
        path: 'order-management',
        loadChildren: () => import('../order-management/order-management.module').then(m => m.OrderManagementModule)
      },
      {
        path: 'invoice-management',
        loadChildren: () => import('../invoice-management/invoice-management.module').then(m => m.InvoiceManagementModule)
      },
      {
        path: 'menu',
        redirectTo: '',  // Redirects to root or specify the current path segment
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
