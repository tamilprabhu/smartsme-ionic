import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoiceViewComponent } from './invoice-view.component';

@NgModule({
  imports: [InvoiceViewComponent, RouterModule.forChild([{ path: '', component: InvoiceViewComponent }])]
})
export class InvoiceViewModule {}
