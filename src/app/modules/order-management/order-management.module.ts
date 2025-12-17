import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OrderManagementComponent } from './order-management.component';
import { HeaderComponent } from 'src/app/components/header/header.component';

@NgModule({
  declarations: [OrderManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderComponent,
    FormsModule,
    RouterModule.forChild([{ path: '', component: OrderManagementComponent }])
  ],
  exports: [OrderManagementComponent],
  providers: [AlertController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderManagementModule {}
