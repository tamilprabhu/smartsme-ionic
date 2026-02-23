import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockListComponent } from './stock-list.component';

@NgModule({
  imports: [StockListComponent, RouterModule.forChild([{ path: '', component: StockListComponent }])]
})
export class StockListModule {}
