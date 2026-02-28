import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductUpdateComponent } from './product-update.component';

@NgModule({
    imports: [
        ProductUpdateComponent,
        RouterModule.forChild([{ path: '', component: ProductUpdateComponent }]),
    ],
})
export class ProductUpdateModule {}
