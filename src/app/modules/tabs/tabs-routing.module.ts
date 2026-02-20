import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ModuleAccessGuard } from 'src/app/guards/module-access.guard';

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
        loadChildren: () => import('../operations/operations.module').then(m => m.OperationsPageModule),
        canActivate: [ModuleAccessGuard],
        data: { anyModuleKeys: ['STOCK_INWARD', 'ORDER', 'INVOICE', 'DISPATCH', 'PRODUCTION_SHIFT'] }
      },
      {
        path: 'profile-masters',
        loadChildren: () => import('../profile-masters/profile-masters.module').then(m => m.ProfileMastersPageModule),
        canActivate: [ModuleAccessGuard],
        data: {
          anyModuleKeys: [
            'PROFILE',
            'CHANGE_PASSWORD',
            'COMPANY',
            'MACHINE_PROCESS',
            'EMPLOYEES',
            'SELLERS',
            'BUYERS',
            'PRODUCTS'
          ]
        }
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsPageModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'REPORTS' }
      },
      {
        path: 'production-shift',
        loadChildren: () => import('../production-shift/production-shift.module').then(m => m.ProductionShiftModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'PRODUCTION_SHIFT' }
      },
      {
        path: 'dispatch-management',
        loadChildren: () => import('../dispatch-management/dispatch-management.module').then(m => m.DispatchManagementModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'DISPATCH' }
      },
      {
        path: 'stock-management',
        loadChildren: () => import('../stock-management/stock-management.module').then(m => m.StockManagementModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'STOCK_INWARD' }
      },
      {
        path: 'order-management',
        loadChildren: () => import('../order-management/order-management.module').then(m => m.OrderManagementModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'ORDER' }
      },
      {
        path: 'invoice-management',
        loadChildren: () => import('../invoice-management/invoice-management.module').then(m => m.InvoiceManagementModule),
        canActivate: [ModuleAccessGuard],
        data: { moduleKey: 'INVOICE' }
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
