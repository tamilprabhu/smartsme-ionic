import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionShiftPage } from './production-shift.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HeaderComponent } from '../../components/header/header.component';

import { ProductionShiftPageRoutingModule } from './production-shift-routing.module';
import { ProductionEntryComponent } from 'src/app/forms/production-entry/production-entry.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HeaderComponent,
    ProductionEntryComponent,
    ProductionShiftPageRoutingModule
  ],
  declarations: [ProductionShiftPage]
})
export class ProductionShiftPageModule {}
