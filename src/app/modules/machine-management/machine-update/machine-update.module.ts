import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineUpdateComponent } from './machine-update.component';

@NgModule({
    imports: [
        MachineUpdateComponent,
        RouterModule.forChild([{ path: '', component: MachineUpdateComponent }]),
    ],
})
export class MachineUpdateModule {}
