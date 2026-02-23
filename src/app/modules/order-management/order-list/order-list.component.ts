import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonSearchbar, IonicModule } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ConfirmDialogService } from 'src/app/components/confirm-dialog-modal/confirm-dialog.service';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent]
})
export class OrderListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  orders: Order[] = [];
  currentPage = 1;
  hasMore = true;
  loading = false;
  listError = '';

  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly destroy$ = new Subject<void>();
  private backTarget = '/tabs/operations';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly orderService: OrderService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.backTarget = this.route.snapshot.queryParamMap.get('from') === 'dashboard'
      ? '/tabs/home'
      : '/tabs/operations';

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetListing();
        this.loadOrders();
      });

    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(event?: CustomEvent): void {
    if (this.loading || !this.hasMore) {
      this.completeInfinite(event);
      return;
    }

    this.loading = true;
    this.listError = '';

    this.orderService.getOrders(this.currentPage, 10, this.searchControl.value).subscribe({
      next: (response) => {
        this.orders = this.currentPage === 1 ? response.items : [...this.orders, ...response.items];
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage += 1;
        this.loading = false;
        this.completeInfinite(event);
      },
      error: (error) => {
        this.loading = false;
        this.listError = error?.error?.error || error?.message || 'Failed to load orders';
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

  createOrder(): void {
    this.router.navigate(['/orders/create']);
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/orders', order.orderSequence]);
  }

  editOrder(order: Order, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/orders', order.orderSequence, 'edit']);
  }

  async confirmDelete(order: Order, event: Event): Promise<void> {
    event.stopPropagation();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete order "${order.orderName}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) return;

    this.orderService.deleteOrder(order.orderSequence).subscribe({
      next: () => {
        this.resetListing();
        this.loadOrders();
      },
      error: () => {
        this.listError = 'Failed to delete order';
      }
    });
  }

  onHeaderBackClick(): void {
    this.router.navigate([this.backTarget]);
  }

  trackByOrderSequence(_index: number, order: Order): number {
    return order.orderSequence;
  }

  private resetListing(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.orders = [];
  }

  private completeInfinite(event?: CustomEvent): void {
    const target = event?.target as IonInfiniteScroll | undefined;
    target?.complete();
  }
}
