import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyListComponent } from './company-list.component';

@NgModule({
    imports: [
        CompanyListComponent,
        RouterModule.forChild([{ path: '', component: CompanyListComponent }]),
    ],
})
export class CompanyListModule {}
