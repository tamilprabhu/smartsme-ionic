import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BuyerManagementComponent } from './buyer-management.component';
import { BuyerComponent } from '../../forms/buyer/buyer.component';

@NgModule({
  declarations: [BuyerManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    BuyerComponent,
    RouterModule.forChild([{ path: '', component: BuyerManagementComponent }])
  ],
  exports: [BuyerManagementComponent],
  providers: [AlertController]
})
export class BuyerManagementModule {}
