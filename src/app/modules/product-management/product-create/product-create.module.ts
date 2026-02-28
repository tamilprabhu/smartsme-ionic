import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCreateComponent } from './product-create.component';

@NgModule({
    imports: [
        ProductCreateComponent,
        RouterModule.forChild([{ path: '', component: ProductCreateComponent }]),
    ],
})
export class ProductCreateModule {}
