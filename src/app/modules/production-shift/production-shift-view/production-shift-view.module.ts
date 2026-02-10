import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductionShiftViewComponent } from './production-shift-view.component';

@NgModule({
  imports: [
    ProductionShiftViewComponent,
    RouterModule.forChild([{ path: '', component: ProductionShiftViewComponent }])
  ]
})
export class ProductionShiftViewModule {}
