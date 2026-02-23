import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellerViewComponent } from './seller-view.component';

@NgModule({
  imports: [SellerViewComponent, RouterModule.forChild([{ path: '', component: SellerViewComponent }])]
})
export class SellerViewModule {}
