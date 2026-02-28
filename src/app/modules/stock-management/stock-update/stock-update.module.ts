import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockUpdateComponent } from './stock-update.component';

@NgModule({
    imports: [
        StockUpdateComponent,
        RouterModule.forChild([{ path: '', component: StockUpdateComponent }]),
    ],
})
export class StockUpdateModule {}
