import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./company-list/company-list.module').then((m) => m.CompanyListModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./company-create/company-create.module').then((m) => m.CompanyCreateModule)
  },
  {
    path: ':id/edit',
    loadChildren: () => import('./company-update/company-update.module').then((m) => m.CompanyUpdateModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./company-view/company-view.module').then((m) => m.CompanyViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyManagementRoutingModule {}
