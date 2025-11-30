import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductManagementComponent } from './product-management.component';
import { ProductComponent } from '../../forms/product/product.component';

@NgModule({
  declarations: [ProductManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ProductComponent,
    RouterModule.forChild([{ path: '', component: ProductManagementComponent }])
  ],
  exports: [ProductManagementComponent],
  providers: [AlertController]
})
export class ProductManagementModule {}
