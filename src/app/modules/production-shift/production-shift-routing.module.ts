import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./production-shift-list/production-shift-list.module').then(m => m.ProductionShiftListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./production-shift-create/production-shift-create.module').then(m => m.ProductionShiftCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./production-shift-update/production-shift-update.module').then(m => m.ProductionShiftUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./production-shift-view/production-shift-view.module').then(m => m.ProductionShiftViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionShiftRoutingModule {}
