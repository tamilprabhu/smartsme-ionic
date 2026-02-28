import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./buyer-list/buyer-list.module').then((m) => m.BuyerListModule),
    },
    {
        path: 'create',
        loadChildren: () =>
            import('./buyer-create/buyer-create.module').then((m) => m.BuyerCreateModule),
    },
    {
        path: ':id/edit',
        loadChildren: () =>
            import('./buyer-update/buyer-update.module').then((m) => m.BuyerUpdateModule),
    },
    {
        path: ':id',
        loadChildren: () => import('./buyer-view/buyer-view.module').then((m) => m.BuyerViewModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BuyerManagementRoutingModule {}
