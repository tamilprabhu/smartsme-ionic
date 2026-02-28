import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { EmployeeManagementComponent } from './employee-management.component';
import { EmployeeManagementRoutingModule } from './employee-management-routing.module';

@NgModule({
    declarations: [EmployeeManagementComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderComponent,
        EmployeeManagementRoutingModule,
    ],
    exports: [EmployeeManagementComponent],
    providers: [AlertController],
})
export class EmployeeManagementModule {}
