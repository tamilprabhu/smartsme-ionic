import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SellerManagementComponent } from './seller-management.component';
import { SellerComponent } from '../../forms/seller/seller.component';
import { HeaderComponent } from '../../components/header/header.component';

@NgModule({
  declarations: [SellerManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    SellerComponent,
    HeaderComponent,
    RouterModule.forChild([{ path: '', component: SellerManagementComponent }])
  ],
  exports: [SellerManagementComponent],
  providers: [AlertController]
})
export class SellerManagementModule {}
