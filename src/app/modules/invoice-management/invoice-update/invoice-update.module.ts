import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoiceUpdateComponent } from './invoice-update.component';

@NgModule({
  imports: [InvoiceUpdateComponent, RouterModule.forChild([{ path: '', component: InvoiceUpdateComponent }])]
})
export class InvoiceUpdateModule {}
