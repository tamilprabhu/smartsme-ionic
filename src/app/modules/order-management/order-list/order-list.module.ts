import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list.component';

@NgModule({
    imports: [
        OrderListComponent,
        RouterModule.forChild([{ path: '', component: OrderListComponent }]),
    ],
})
export class OrderListModule {}
