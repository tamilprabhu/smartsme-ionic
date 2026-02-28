import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./product-list/product-list.module').then((m) => m.ProductListModule),
    },
    {
        path: 'create',
        loadChildren: () =>
            import('./product-create/product-create.module').then((m) => m.ProductCreateModule),
    },
    {
        path: ':id/edit',
        loadChildren: () =>
            import('./product-update/product-update.module').then((m) => m.ProductUpdateModule),
    },
    {
        path: ':id',
        loadChildren: () =>
            import('./product-view/product-view.module').then((m) => m.ProductViewModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductManagementRoutingModule {}
