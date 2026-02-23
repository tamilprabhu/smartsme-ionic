import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoiceCreateComponent } from './invoice-create.component';

@NgModule({
  imports: [InvoiceCreateComponent, RouterModule.forChild([{ path: '', component: InvoiceCreateComponent }])]
})
export class InvoiceCreateModule {}
