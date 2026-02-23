import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuyerViewComponent } from './buyer-view.component';

@NgModule({
  imports: [BuyerViewComponent, RouterModule.forChild([{ path: '', component: BuyerViewComponent }])]
})
export class BuyerViewModule {}
