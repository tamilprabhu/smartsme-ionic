import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuyerCreateComponent } from './buyer-create.component';

@NgModule({
  imports: [BuyerCreateComponent, RouterModule.forChild([{ path: '', component: BuyerCreateComponent }])]
})
export class BuyerCreateModule {}
