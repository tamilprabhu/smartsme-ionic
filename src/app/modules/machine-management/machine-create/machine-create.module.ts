import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineCreateComponent } from './machine-create.component';

@NgModule({
    imports: [
        MachineCreateComponent,
        RouterModule.forChild([{ path: '', component: MachineCreateComponent }]),
    ],
})
export class MachineCreateModule {}
