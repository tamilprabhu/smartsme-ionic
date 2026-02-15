import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';

import { ProfileMastersPageRoutingModule } from './profile-masters-routing.module';
import { ProfileMastersPage } from './profile-masters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileMastersPageRoutingModule,
    HeaderComponent
  ],
  declarations: [ProfileMastersPage]
})
export class ProfileMastersPageModule {}
