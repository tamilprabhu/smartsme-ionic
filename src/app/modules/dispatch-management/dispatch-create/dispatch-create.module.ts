import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DispatchCreateComponent } from './dispatch-create.component';

@NgModule({
  imports: [DispatchCreateComponent, RouterModule.forChild([{ path: '', component: DispatchCreateComponent }])]
})
export class DispatchCreateModule {}
