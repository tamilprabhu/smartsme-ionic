import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderCreateComponent } from './order-create.component';

@NgModule({
  imports: [OrderCreateComponent, RouterModule.forChild([{ path: '', component: OrderCreateComponent }])]
})
export class OrderCreateModule {}
