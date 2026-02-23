import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuyerUpdateComponent } from './buyer-update.component';

@NgModule({
  imports: [BuyerUpdateComponent, RouterModule.forChild([{ path: '', component: BuyerUpdateComponent }])]
})
export class BuyerUpdateModule {}
