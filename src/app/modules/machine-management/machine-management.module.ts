import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { MachineManagementComponent } from './machine-management.component';
import { MachineProcessComponent } from 'src/app/forms/machine-process/machine-process.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MachineManagementComponent],
  imports: [
    CommonModule, 
    IonicModule, 
    ReactiveFormsModule, 
    MachineProcessComponent,
    RouterModule.forChild([
      { path: '', component: MachineManagementComponent },
    ]),
  ],
  exports: [MachineManagementComponent],
  providers: [AlertController]
})
export class MachineManagementModule {}
