import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineListComponent } from './machine-list.component';

@NgModule({
  imports: [MachineListComponent, RouterModule.forChild([{ path: '', component: MachineListComponent }])]
})
export class MachineListModule {}
