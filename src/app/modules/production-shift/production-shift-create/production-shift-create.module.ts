import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductionShiftCreateComponent } from './production-shift-create.component';

@NgModule({
  imports: [
    ProductionShiftCreateComponent,
    RouterModule.forChild([{ path: '', component: ProductionShiftCreateComponent }])
  ]
})
export class ProductionShiftCreateModule {}
