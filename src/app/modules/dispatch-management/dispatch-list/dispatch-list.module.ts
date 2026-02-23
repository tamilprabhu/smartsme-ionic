import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DispatchListComponent } from './dispatch-list.component';

@NgModule({
  imports: [DispatchListComponent, RouterModule.forChild([{ path: '', component: DispatchListComponent }])]
})
export class DispatchListModule {}
