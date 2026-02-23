import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoiceListComponent } from './invoice-list.component';

@NgModule({
  imports: [InvoiceListComponent, RouterModule.forChild([{ path: '', component: InvoiceListComponent }])]
})
export class InvoiceListModule {}
