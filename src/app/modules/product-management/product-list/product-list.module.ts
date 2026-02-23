import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list.component';

@NgModule({
  imports: [ProductListComponent, RouterModule.forChild([{ path: '', component: ProductListComponent }])]
})
export class ProductListModule {}
