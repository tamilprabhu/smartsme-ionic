import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./invoice-list/invoice-list.module').then((m) => m.InvoiceListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./invoice-create/invoice-create.module').then((m) => m.InvoiceCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./invoice-update/invoice-update.module').then((m) => m.InvoiceUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./invoice-view/invoice-view.module').then((m) => m.InvoiceViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceManagementRoutingModule {}
