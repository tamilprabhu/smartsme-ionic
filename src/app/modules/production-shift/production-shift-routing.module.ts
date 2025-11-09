import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionShiftPage } from './production-shift.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionShiftPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionShiftPageRoutingModule {}
