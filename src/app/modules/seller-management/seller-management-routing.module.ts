import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./seller-list/seller-list.module').then((m) => m.SellerListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./seller-create/seller-create.module').then((m) => m.SellerCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./seller-update/seller-update.module').then((m) => m.SellerUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./seller-view/seller-view.module').then((m) => m.SellerViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerManagementRoutingModule {}
