import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./order-list/order-list.module').then((m) => m.OrderListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./order-create/order-create.module').then((m) => m.OrderCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./order-update/order-update.module').then((m) => m.OrderUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./order-view/order-view.module').then((m) => m.OrderViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagementRoutingModule {}
