import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonSearchbar, IonicModule } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ConfirmDialogService } from 'src/app/components/confirm-dialog-modal/confirm-dialog.service';
import { SortBy } from 'src/app/enums/sort-by.enum';
import { SortOrder } from 'src/app/enums/sort-order.enum';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent],
})
export class ProductListComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInput!: IonSearchbar;

    products: Product[] = [];
    currentPage = 1;
    hasMore = true;
    loading = false;
    listError = '';
    sortBy: SortBy = SortBy.CREATE_DATE;
    sortOrder: SortOrder = SortOrder.DESC;
    showSortOptions = false;

    readonly sortByOptions = [
        { label: 'Create Date', value: SortBy.CREATE_DATE },
        { label: 'Update Date', value: SortBy.UPDATE_DATE },
        { label: 'Sequence', value: SortBy.SEQUENCE },
        { label: 'Created By', value: SortBy.CREATED_BY },
        { label: 'Updated By', value: SortBy.UPDATED_BY },
    ];

    readonly sortOrderOptions = [
        { label: 'Descending', value: SortOrder.DESC },
        { label: 'Ascending', value: SortOrder.ASC },
    ];

    readonly searchControl = new FormControl('', { nonNullable: true });

    private readonly destroy$ = new Subject<void>();
    private backTarget = '/tabs/profile-masters';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly productService: ProductService,
        private readonly confirmDialog: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.backTarget =
            this.route.snapshot.queryParamMap.get('from') === 'dashboard'
                ? '/tabs/home'
                : '/tabs/profile-masters';

        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                this.resetListing();
                this.loadProducts();
            });

        this.loadProducts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadProducts(event?: CustomEvent): void {
        if (this.loading || !this.hasMore) {
            this.completeInfinite(event);
            return;
        }

        this.loading = true;
        this.listError = '';

        this.productService
            .getProducts(
                this.currentPage,
                10,
                this.searchControl.value,
                this.sortBy,
                this.sortOrder,
            )
            .subscribe({
                next: (response) => {
                    this.products =
                        this.currentPage === 1
                            ? response.items
                            : [...this.products, ...response.items];
                    this.hasMore = response.paging.currentPage < response.paging.totalPages;
                    this.currentPage += 1;
                    this.loading = false;
                    this.completeInfinite(event);
                },
                error: (error) => {
                    this.loading = false;
                    this.listError =
                        error?.error?.error || error?.message || 'Failed to load products';
                    this.completeInfinite(event);
                },
            });
    }

    onSearchInput(event: Event): void {
        const value = (event as CustomEvent).detail?.value ?? '';
        this.searchControl.setValue(value, { emitEvent: true });
    }

    clearSearch(): void {
        this.searchControl.setValue('', { emitEvent: true });
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }

    toggleSortOptions(): void {
        this.showSortOptions = !this.showSortOptions;
    }

    onSortChange(): void {
        this.resetListing();
        this.loadProducts();
    }

    createProduct(): void {
        this.router.navigate(['/products/create']);
    }

    viewProduct(product: Product): void {
        this.router.navigate(['/products', product.productSequence]);
    }

    editProduct(product: Product, event: Event): void {
        event.stopPropagation();
        this.router.navigate(['/products', product.productSequence, 'edit']);
    }

    async confirmDelete(product: Product, event: Event): Promise<void> {
        event.stopPropagation();

        const confirmed = await this.confirmDialog.confirm({
            title: 'Confirm Delete',
            message: `Are you sure you want to delete product "${product.productName}"?`,
            confirmText: 'Delete',
            confirmColor: 'danger',
        });

        if (!confirmed) return;

        this.productService.deleteProduct(product.productSequence).subscribe({
            next: () => {
                this.resetListing();
                this.loadProducts();
            },
            error: () => {
                this.listError = 'Failed to delete product';
            },
        });
    }

    onHeaderBackClick(): void {
        this.router.navigate([this.backTarget]);
    }

    trackByProductSequence(_index: number, product: Product): number {
        return product.productSequence;
    }

    private resetListing(): void {
        this.currentPage = 1;
        this.hasMore = true;
        this.products = [];
    }

    private completeInfinite(event?: CustomEvent): void {
        const target = event?.target as IonInfiniteScroll | undefined;
        target?.complete();
    }
}
