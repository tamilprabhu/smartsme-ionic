import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyUpdateComponent } from './company-update.component';

@NgModule({
    imports: [
        CompanyUpdateComponent,
        RouterModule.forChild([{ path: '', component: CompanyUpdateComponent }]),
    ],
})
export class CompanyUpdateModule {}
