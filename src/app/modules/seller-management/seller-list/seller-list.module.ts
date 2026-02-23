import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellerListComponent } from './seller-list.component';

@NgModule({
  imports: [SellerListComponent, RouterModule.forChild([{ path: '', component: SellerListComponent }])]
})
export class SellerListModule {}
