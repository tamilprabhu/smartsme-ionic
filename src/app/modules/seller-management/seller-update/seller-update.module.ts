import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellerUpdateComponent } from './seller-update.component';

@NgModule({
    imports: [
        SellerUpdateComponent,
        RouterModule.forChild([{ path: '', component: SellerUpdateComponent }]),
    ],
})
export class SellerUpdateModule {}
