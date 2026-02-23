import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management.component';

const routes: Routes = [
  { path: '', component: EmployeeManagementComponent },
  { path: 'create', component: EmployeeManagementComponent },
  { path: ':id/edit', component: EmployeeManagementComponent },
  { path: ':id', component: EmployeeManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule {}
