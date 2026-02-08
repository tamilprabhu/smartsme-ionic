import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StockManagementComponent } from './stock-management.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StockComponent } from 'src/app/forms/stock/stock.component';

@NgModule({
  declarations: [StockManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    StockComponent,
    HeaderComponent,
    FormsModule,
    RouterModule.forChild([{ path: '', component: StockManagementComponent }])
  ],
  exports: [StockManagementComponent],
  providers: [AlertController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StockManagementModule {}
