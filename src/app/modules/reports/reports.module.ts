import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsPage } from './reports.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ReportsPageRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ReportsPageRoutingModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
