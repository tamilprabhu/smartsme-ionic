import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyViewComponent } from './company-view.component';

@NgModule({
    imports: [
        CompanyViewComponent,
        RouterModule.forChild([{ path: '', component: CompanyViewComponent }]),
    ],
})
export class CompanyViewModule {}
