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
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent]
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  invoices: Invoice[] = [];
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
    private readonly invoiceService: InvoiceService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetListing();
        this.loadInvoices();
      });

    this.loadInvoices();
  }

  ionViewWillEnter(): void {
    this.resetListing();
    this.loadInvoices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInvoices(event?: CustomEvent): void {
    if (this.loading || !this.hasMore) {
      this.completeInfinite(event);
      return;
    }

    this.loading = true;
    this.listError = '';

    this.invoiceService
      .getInvoices(this.currentPage, 10, this.searchControl.value, this.sortBy, this.sortOrder)
      .subscribe({
        next: (response) => {
          this.invoices = this.currentPage === 1 ? response.items : [...this.invoices, ...response.items];
          this.hasMore = response.paging.currentPage < response.paging.totalPages;
          this.currentPage += 1;
          this.loading = false;
          this.completeInfinite(event);
        },
        error: (error) => {
          this.loading = false;
          this.listError = error?.error?.message || error?.message || 'Failed to load invoices';
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
    this.loadInvoices();
  }

  createInvoice(): void {
    this.router.navigate(['/invoice/create']);
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoice', invoice.invoiceSequence]);
  }

  editInvoice(invoice: Invoice, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/invoice', invoice.invoiceSequence, 'edit']);
  }

  async confirmDelete(invoice: Invoice, event: Event): Promise<void> {
    event.stopPropagation();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete invoice "${invoice.invoiceId}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) return;

    this.invoiceService.deleteInvoice(invoice.invoiceSequence).subscribe({
      next: () => {
        this.resetListing();
        this.loadInvoices();
      },
      error: () => {
        this.listError = 'Failed to delete invoice';
      }
    });
  }

  onHeaderBackClick(): void {
    this.router.navigate(['/tabs/operations']);
  }

  trackByInvoiceSequence(_index: number, invoice: Invoice): number {
    return invoice.invoiceSequence;
  }

  private resetListing(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.invoices = [];
  }

  private completeInfinite(event?: CustomEvent): void {
    const target = event?.target as IonInfiniteScroll | undefined;
    target?.complete();
  }
}
