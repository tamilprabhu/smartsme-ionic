import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductViewComponent } from './product-view.component';

@NgModule({
  imports: [ProductViewComponent, RouterModule.forChild([{ path: '', component: ProductViewComponent }])]
})
export class ProductViewModule {}
