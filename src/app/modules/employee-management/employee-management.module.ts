import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management.component';
import { HeaderComponent } from '../../components/header/header.component';

@NgModule({
  declarations: [EmployeeManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    RouterModule.forChild([
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: EmployeeManagementComponent },
      { path: 'create', component: EmployeeManagementComponent },
      { path: 'view/:path-param', component: EmployeeManagementComponent },
      { path: 'update/:path-param', component: EmployeeManagementComponent },
      { path: 'delete/:path-param', component: EmployeeManagementComponent }
    ])
  ],
  exports: [EmployeeManagementComponent],
  providers: [AlertController]
})
export class EmployeeManagementModule {}
