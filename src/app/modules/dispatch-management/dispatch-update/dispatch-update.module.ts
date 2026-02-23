import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DispatchUpdateComponent } from './dispatch-update.component';

@NgModule({
  imports: [DispatchUpdateComponent, RouterModule.forChild([{ path: '', component: DispatchUpdateComponent }])]
})
export class DispatchUpdateModule {}
