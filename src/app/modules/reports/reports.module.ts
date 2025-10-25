import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsPage } from './reports.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ReportsPageRoutingModule } from './reports-routing.module';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ReportsPageRoutingModule,
    FooterComponent
  ],
  declarations: [ReportsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsPageModule {}
