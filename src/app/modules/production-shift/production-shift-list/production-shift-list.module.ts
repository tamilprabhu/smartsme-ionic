import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductionShiftListComponent } from './production-shift-list.component';

@NgModule({
  imports: [
    ProductionShiftListComponent,
    RouterModule.forChild([{ path: '', component: ProductionShiftListComponent }])
  ]
})
export class ProductionShiftListModule {}
