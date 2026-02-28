import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineViewComponent } from './machine-view.component';

@NgModule({
    imports: [
        MachineViewComponent,
        RouterModule.forChild([{ path: '', component: MachineViewComponent }]),
    ],
})
export class MachineViewModule {}
