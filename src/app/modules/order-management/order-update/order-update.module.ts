import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderUpdateComponent } from './order-update.component';

@NgModule({
  imports: [OrderUpdateComponent, RouterModule.forChild([{ path: '', component: OrderUpdateComponent }])]
})
export class OrderUpdateModule {}
