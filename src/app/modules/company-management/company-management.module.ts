import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CompanyManagementComponent } from './company-management.component';
import { CompanyComponent } from '../../forms/company/company.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CompanyManagementComponent],
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    CompanyComponent,
    RouterModule.forChild([
      { path: '', component: CompanyManagementComponent },
    ])
  ],
  exports: [CompanyManagementComponent],
  providers: [AlertController]
})
export class CompanyManagementModule {}
