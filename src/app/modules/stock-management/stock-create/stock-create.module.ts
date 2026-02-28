import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockCreateComponent } from './stock-create.component';

@NgModule({
    imports: [
        StockCreateComponent,
        RouterModule.forChild([{ path: '', component: StockCreateComponent }]),
    ],
})
export class StockCreateModule {}
