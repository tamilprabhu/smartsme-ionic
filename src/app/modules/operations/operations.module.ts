import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationsPage } from './opearations.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { OperationsPageRoutingModule } from './operations-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    OperationsPageRoutingModule
  ],
  declarations: [OperationsPage]
})
export class OperationsPageModule {}
