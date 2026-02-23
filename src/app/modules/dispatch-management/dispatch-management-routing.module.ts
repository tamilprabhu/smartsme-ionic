import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dispatch-list/dispatch-list.module').then((m) => m.DispatchListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./dispatch-create/dispatch-create.module').then((m) => m.DispatchCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./dispatch-update/dispatch-update.module').then((m) => m.DispatchUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./dispatch-view/dispatch-view.module').then((m) => m.DispatchViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchManagementRoutingModule {}
