import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuyerListComponent } from './buyer-list.component';

@NgModule({
  imports: [BuyerListComponent, RouterModule.forChild([{ path: '', component: BuyerListComponent }])]
})
export class BuyerListModule {}
