import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonSearchbar, IonicModule } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ConfirmDialogService } from 'src/app/components/confirm-dialog-modal/confirm-dialog.service';
import { SortBy } from 'src/app/enums/sort-by.enum';
import { SortOrder } from 'src/app/enums/sort-order.enum';
import { Dispatch } from 'src/app/models/dispatch.model';
import { DispatchService } from 'src/app/services/dispatch.service';

@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent]
})
export class DispatchListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  dispatches: Dispatch[] = [];
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
    { label: 'Updated By', value: SortBy.UPDATED_BY }
  ];

  readonly sortOrderOptions = [
    { label: 'Descending', value: SortOrder.DESC },
    { label: 'Ascending', value: SortOrder.ASC }
  ];

  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly dispatchService: DispatchService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetListing();
        this.loadDispatches();
      });

    this.loadDispatches();
  }

  ionViewWillEnter(): void {
    this.resetListing();
    this.loadDispatches();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDispatches(event?: CustomEvent): void {
    if (this.loading || !this.hasMore) {
      this.completeInfinite(event);
      return;
    }

    this.loading = true;
    this.listError = '';

    this.dispatchService
      .getDispatches(this.currentPage, 10, this.searchControl.value, this.sortBy, this.sortOrder)
      .subscribe({
        next: (response) => {
          this.dispatches = this.currentPage === 1 ? response.items : [...this.dispatches, ...response.items];
          this.hasMore = response.paging.currentPage < response.paging.totalPages;
          this.currentPage += 1;
          this.loading = false;
          this.completeInfinite(event);
        },
        error: (error) => {
          this.loading = false;
          this.listError = error?.error?.message || error?.message || 'Failed to load dispatches';
          this.completeInfinite(event);
        }
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
    this.loadDispatches();
  }

  createDispatch(): void {
    this.router.navigate(['/dispatch/create']);
  }

  viewDispatch(dispatch: Dispatch): void {
    this.router.navigate(['/dispatch', dispatch.dispatchSequence]);
  }

  editDispatch(dispatch: Dispatch, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dispatch', dispatch.dispatchSequence, 'edit']);
  }

  async confirmDelete(dispatch: Dispatch, event: Event): Promise<void> {
    event.stopPropagation();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete dispatch "${dispatch.dispatchId}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) return;

    this.dispatchService.deleteDispatch(dispatch.dispatchSequence).subscribe({
      next: () => {
        this.resetListing();
        this.loadDispatches();
      },
      error: () => {
        this.listError = 'Failed to delete dispatch';
      }
    });
  }

  onHeaderBackClick(): void {
    this.router.navigate(['/tabs/operations']);
  }

  trackByDispatchSequence(_index: number, dispatch: Dispatch): number {
    return dispatch.dispatchSequence;
  }

  private resetListing(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.dispatches = [];
  }

  private completeInfinite(event?: CustomEvent): void {
    const target = event?.target as IonInfiniteScroll | undefined;
    target?.complete();
  }
}
