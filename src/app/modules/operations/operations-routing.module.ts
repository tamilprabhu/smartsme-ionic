import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsPage } from './opearations.page';

const routes: Routes = [
  {
    path: '',
    component: OperationsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsPageRoutingModule {}
