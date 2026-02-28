import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockViewComponent } from './stock-view.component';

@NgModule({
    imports: [
        StockViewComponent,
        RouterModule.forChild([{ path: '', component: StockViewComponent }]),
    ],
})
export class StockViewModule {}
