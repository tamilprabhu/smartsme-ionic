import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./machine-list/machine-list.module').then((m) => m.MachineListModule),
    },
    {
        path: 'create',
        loadChildren: () =>
            import('./machine-create/machine-create.module').then((m) => m.MachineCreateModule),
    },
    {
        path: ':id/edit',
        loadChildren: () =>
            import('./machine-update/machine-update.module').then((m) => m.MachineUpdateModule),
    },
    {
        path: ':id',
        loadChildren: () =>
            import('./machine-view/machine-view.module').then((m) => m.MachineViewModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MachineManagementRoutingModule {}
