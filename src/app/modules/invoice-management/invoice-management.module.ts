import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceManagementComponent } from './invoice-management.component';
import { HeaderComponent } from '../../components/header/header.component';

import { InvoiceManagementRoutingModule } from './invoice-management-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    InvoiceManagementRoutingModule
  ],
  declarations: [InvoiceManagementComponent]
})
export class InvoiceManagementModule {}
