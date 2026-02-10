import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductionShiftUpdateComponent } from './production-shift-update.component';

@NgModule({
  imports: [
    ProductionShiftUpdateComponent,
    RouterModule.forChild([{ path: '', component: ProductionShiftUpdateComponent }])
  ]
})
export class ProductionShiftUpdateModule {}
