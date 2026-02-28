import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DispatchViewComponent } from './dispatch-view.component';

@NgModule({
    imports: [
        DispatchViewComponent,
        RouterModule.forChild([{ path: '', component: DispatchViewComponent }]),
    ],
})
export class DispatchViewModule {}
