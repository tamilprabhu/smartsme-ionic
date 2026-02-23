import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderViewComponent } from './order-view.component';

@NgModule({
  imports: [OrderViewComponent, RouterModule.forChild([{ path: '', component: OrderViewComponent }])]
})
export class OrderViewModule {}
