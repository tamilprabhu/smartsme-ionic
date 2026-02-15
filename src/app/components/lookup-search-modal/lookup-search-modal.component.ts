import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ItemsPerPage } from 'src/app/enums/items-per-page.enum';
import { EmployeeService } from 'src/app/services/employee.service';
import { MachineService } from 'src/app/services/machine.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

export interface LookupItem {
  value: string | number;
  label: string;
}

type LookupResource = 'order' | 'machine' | 'product' | 'employee';

@Component({
  selector: 'app-lookup-search-modal',
  templateUrl: './lookup-search-modal.component.html',
  styleUrls: ['./lookup-search-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LookupSearchModalComponent implements OnInit {
  @Input() title = 'Select';
  @Input() resource: LookupResource = 'order';
  @Input() selectedValue: string | number | null = null;
  @Input() allowClear = false;
  @Input() roleNames: string[] = [];

  items: LookupItem[] = [];
  searchTerm = '';
  page = 1;
  totalPages = 1;
  loading = false;
  errorMessage = '';
  private searchTimeout?: number;

  constructor(
    private orderService: OrderService,
    private machineService: MachineService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadPage(1);
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = window.setTimeout(() => {
      this.loadPage(1);
    }, 300);
  }

  loadMore(event?: any) {
    if (this.loading || this.page >= this.totalPages) {
      if (event) {
        event.target.complete();
        event.target.disabled = true;
      }
      return;
    }
    this.loadPage(this.page + 1, true, event);
  }

  selectItem(item: LookupItem) {
    this.modalController.dismiss(item, 'select');
  }

  clearSelection() {
    this.modalController.dismiss(null, 'clear');
  }

  close() {
    this.modalController.dismiss(null, 'cancel');
  }

  isSelected(item: LookupItem): boolean {
    return item.value === this.selectedValue;
  }

  private loadPage(page: number, append: boolean = false, event?: any) {
    this.loading = true;
    this.errorMessage = '';

    const onSuccess = (items: LookupItem[], totalPages: number, currentPage: number) => {
      this.page = currentPage;
      this.totalPages = totalPages;
      this.items = append ? [...this.items, ...items] : items;
      this.loading = false;
      if (event) {
        event.target.complete();
        event.target.disabled = this.page >= this.totalPages;
      }
    };

    const onError = (error: any) => {
      this.errorMessage = error?.message || 'Failed to load items';
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    };

    if (this.resource === 'order') {
      this.orderService.getOrders(page, ItemsPerPage.TEN, this.searchTerm).subscribe({
        next: (response) => {
          const items = response.items.map(item => ({
            value: item.orderId,
            label: `${item.orderName} (${item.orderId})`
          }));
          onSuccess(items, response.paging.totalPages, response.paging.currentPage);
        },
        error: onError
      });
      return;
    }

    if (this.resource === 'machine') {
      this.machineService.getMachines(page, ItemsPerPage.TEN, this.searchTerm).subscribe({
        next: (response) => {
          const items = response.items.map(item => ({
            value: item.machineId,
            label: `${item.machineName} (${item.machineId})`
          }));
          onSuccess(items, response.paging.totalPages, response.paging.currentPage);
        },
        error: onError
      });
      return;
    }

    if (this.resource === 'employee') {
      this.employeeService.getEmployeesByRole(this.roleNames, page, ItemsPerPage.TEN, this.searchTerm).subscribe({
        next: (response) => {
          const items = response.items.map(item => ({
            value: item.value,
            label: item.label
          }));
          onSuccess(items, response.paging.totalPages, response.paging.currentPage);
        },
        error: onError
      });
      return;
    }

    this.productService.getProducts(page, ItemsPerPage.TEN, this.searchTerm).subscribe({
      next: (response) => {
        const items = response.items.map(item => ({
          value: item.productId,
          label: `${item.productName} (${item.productId})`
        }));
        onSuccess(items, response.paging.totalPages, response.paging.currentPage);
      },
      error: onError
    });
  }
}
