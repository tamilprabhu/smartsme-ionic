import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { OperationsService } from 'src/app/services/operations.service';
import { ConfirmDialogService } from '../../components/confirm-dialog-modal/confirm-dialog.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  standalone: false
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  orders: Order[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedOrder: Order | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private readonly confirmDialog: ConfirmDialogService,
    private navCtrl: NavController,
    private orderService: OrderService,
    private operationsService: OperationsService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    console.log('Order Management Component Initialized');
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadOrders(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.orderService.getOrders(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.orders = response.items;
        } else {
          this.orders = [...this.orders, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.hasMore = true;
    this.orders = [];
    this.loadOrders();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedOrder = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(order: Order) {
    this.orderService.getOrder(order.orderSequence).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        this.formMode = 'read';
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
      }
    });
  }

  openUpdateForm(order: Order) {
    this.orderService.getOrder(order.orderSequence).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        this.formMode = 'update';
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
      }
    });
  }

  async confirmDelete(order: Order) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete order "${order.orderName}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.deleteOrder(order);
  }

  deleteOrder(order: Order) {
    this.orderService.deleteOrder(order.orderSequence).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.orderSequence !== order.orderSequence);
        console.log('Order deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting order:', error);
      }
    });
  }

  handleFormSubmit(formData: Order) {
    if (this.formMode === 'create') {
      this.orderService.createOrder(formData).subscribe({
        next: (newOrder) => {
          this.orders.unshift(newOrder);
          this.closeForm();
          console.log('Order created successfully');
        },
        error: (error) => {
          console.error('Error creating order:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedOrder) {
      this.orderService.updateOrder(this.selectedOrder.orderSequence, formData).subscribe({
        next: (updatedOrder) => {
          const index = this.orders.findIndex(o => o.orderSequence === this.selectedOrder?.orderSequence);
          if (index > -1) {
            this.orders[index] = updatedOrder;
          }
          this.closeForm();
          console.log('Order updated successfully');
        },
        error: (error) => {
          console.error('Error updating order:', error);
        }
      });
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedOrder = null;
    this.formMode = null;
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.operationsService.navigateToOperations();
  }
}
