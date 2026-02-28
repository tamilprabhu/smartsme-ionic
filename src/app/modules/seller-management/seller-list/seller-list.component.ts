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
import { Seller } from 'src/app/models/seller.model';
import { SellerService } from 'src/app/services/seller.service';

@Component({
    selector: 'app-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent],
})
export class SellerListComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput') searchInput!: IonSearchbar;

    sellers: Seller[] = [];
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
        private readonly sellerService: SellerService,
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
                this.loadSellers();
            });

        this.loadSellers();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadSellers(event?: CustomEvent): void {
        if (this.loading || !this.hasMore) {
            this.completeInfinite(event);
            return;
        }

        this.loading = true;
        this.listError = '';

        this.sellerService
            .getSellers(this.currentPage, 10, this.searchControl.value, this.sortBy, this.sortOrder)
            .subscribe({
                next: (response) => {
                    this.sellers =
                        this.currentPage === 1
                            ? response.items
                            : [...this.sellers, ...response.items];
                    this.hasMore = response.paging.currentPage < response.paging.totalPages;
                    this.currentPage += 1;
                    this.loading = false;
                    this.completeInfinite(event);
                },
                error: (error) => {
                    this.loading = false;
                    this.listError =
                        error?.error?.error || error?.message || 'Failed to load sellers';
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
        this.loadSellers();
    }

    createSeller(): void {
        this.router.navigate(['/sellers/create']);
    }

    viewSeller(seller: Seller): void {
        this.router.navigate(['/sellers', seller.sellerSequence]);
    }

    editSeller(seller: Seller, event: Event): void {
        event.stopPropagation();
        this.router.navigate(['/sellers', seller.sellerSequence, 'edit']);
    }

    async confirmDelete(seller: Seller, event: Event): Promise<void> {
        event.stopPropagation();

        const confirmed = await this.confirmDialog.confirm({
            title: 'Confirm Delete',
            message: `Are you sure you want to delete seller "${seller.sellerName}"?`,
            confirmText: 'Delete',
            confirmColor: 'danger',
        });

        if (!confirmed) return;

        this.sellerService.deleteSeller(seller.sellerSequence).subscribe({
            next: () => {
                this.resetListing();
                this.loadSellers();
            },
            error: () => {
                this.listError = 'Failed to delete seller';
            },
        });
    }

    onHeaderBackClick(): void {
        this.router.navigate([this.backTarget]);
    }

    trackBySellerSequence(_index: number, seller: Seller): number {
        return seller.sellerSequence;
    }

    private resetListing(): void {
        this.currentPage = 1;
        this.hasMore = true;
        this.sellers = [];
    }

    private completeInfinite(event?: CustomEvent): void {
        const target = event?.target as IonInfiniteScroll | undefined;
        target?.complete();
    }
}
