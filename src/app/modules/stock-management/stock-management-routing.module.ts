import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./stock-list/stock-list.module').then((m) => m.StockListModule),
    },
    {
        path: 'create',
        loadChildren: () =>
            import('./stock-create/stock-create.module').then((m) => m.StockCreateModule),
    },
    {
        path: ':id/edit',
        loadChildren: () =>
            import('./stock-update/stock-update.module').then((m) => m.StockUpdateModule),
    },
    {
        path: ':id',
        loadChildren: () => import('./stock-view/stock-view.module').then((m) => m.StockViewModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StockManagementRoutingModule {}
