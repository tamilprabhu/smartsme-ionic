import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellerCreateComponent } from './seller-create.component';

@NgModule({
  imports: [SellerCreateComponent, RouterModule.forChild([{ path: '', component: SellerCreateComponent }])]
})
export class SellerCreateModule {}
