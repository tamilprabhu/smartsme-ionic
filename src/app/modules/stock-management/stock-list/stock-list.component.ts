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
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
    selector: 'app-stock-list',
    templateUrl: './stock-list.component.html',
    styleUrls: ['./stock-list.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent],
})
export class StockListComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInput!: IonSearchbar;

    stocks: Stock[] = [];
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
    private backTarget = '/tabs/operations';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly stockService: StockService,
        private readonly confirmDialog: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.backTarget =
            this.route.snapshot.queryParamMap.get('from') === 'dashboard'
                ? '/tabs/home'
                : '/tabs/operations';

        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                this.resetListing();
                this.loadStocks();
            });

        this.loadStocks();
    }

    ionViewWillEnter(): void {
        this.resetListing();
        this.loadStocks();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadStocks(event?: CustomEvent): void {
        if (this.loading || !this.hasMore) {
            this.completeInfinite(event);
            return;
        }

        this.loading = true;
        this.listError = '';

        this.stockService
            .getStocks(this.currentPage, 10, this.searchControl.value, this.sortBy, this.sortOrder)
            .subscribe({
                next: (response) => {
                    this.stocks =
                        this.currentPage === 1
                            ? response.items
                            : [...this.stocks, ...response.items];
                    this.hasMore = response.paging.currentPage < response.paging.totalPages;
                    this.currentPage += 1;
                    this.loading = false;
                    this.completeInfinite(event);
                },
                error: (error) => {
                    this.loading = false;
                    this.listError =
                        error?.error?.message || error?.message || 'Failed to load stock records';
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
        this.loadStocks();
    }

    createStock(): void {
        this.router.navigate(['/stock/create']);
    }

    viewStock(stock: Stock): void {
        this.router.navigate(['/stock', stock.stockSequence]);
    }

    editStock(stock: Stock, event: Event): void {
        event.stopPropagation();
        this.router.navigate(['/stock', stock.stockSequence, 'edit']);
    }

    async confirmDelete(stock: Stock, event: Event): Promise<void> {
        event.stopPropagation();

        const confirmed = await this.confirmDialog.confirm({
            title: 'Confirm Delete',
            message: `Are you sure you want to delete stock "${stock.stockId}"?`,
            confirmText: 'Delete',
            confirmColor: 'danger',
        });

        if (!confirmed) return;

        this.stockService.deleteStock(stock.stockSequence).subscribe({
            next: () => {
                this.resetListing();
                this.loadStocks();
            },
            error: () => {
                this.listError = 'Failed to delete stock';
            },
        });
    }

    onHeaderBackClick(): void {
        this.router.navigate([this.backTarget]);
    }

    trackByStockSequence(_index: number, stock: Stock): number {
        return stock.stockSequence;
    }

    private resetListing(): void {
        this.currentPage = 1;
        this.hasMore = true;
        this.stocks = [];
    }

    private completeInfinite(event?: CustomEvent): void {
        const target = event?.target as IonInfiniteScroll | undefined;
        target?.complete();
    }
}
