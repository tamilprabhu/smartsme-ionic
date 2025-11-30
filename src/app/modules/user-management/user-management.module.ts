import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserComponent } from 'src/app/forms/user/user.component';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    UserComponent,
    RouterModule.forChild([
      { path: '', component: UserManagementComponent },
    ])
  ],
  exports: [UserManagementComponent],
  providers: [AlertController]
})
export class UserManagementModule {}
