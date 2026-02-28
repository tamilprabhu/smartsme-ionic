import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyCreateComponent } from './company-create.component';

@NgModule({
    imports: [
        CompanyCreateComponent,
        RouterModule.forChild([{ path: '', component: CompanyCreateComponent }]),
    ],
})
export class CompanyCreateModule {}
