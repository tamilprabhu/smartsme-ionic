import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceManagementComponent } from './invoice-management.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceManagementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceManagementRoutingModule {}
