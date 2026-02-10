import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { Machine } from 'src/app/models/machine.model';
import { Order } from 'src/app/models/order.model';
import { ProductionShiftService } from 'src/app/services/production-shift.service';
import { MachineService } from 'src/app/services/machine.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-production-shift-list',
  templateUrl: './production-shift-list.component.html',
  styleUrls: ['./production-shift-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProductionShiftListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  shifts: ProductionShift[] = [];
  machines: Machine[] = [];
  orders: Order[] = [];
  machineMap: Map<string, string> = new Map();
  orderMap: Map<string, string> = new Map();
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private shiftService: ProductionShiftService,
    private machineService: MachineService,
    private orderService: OrderService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => this.performSearch(query));
  }

  ngOnInit() {
    this.loadMachines();
    this.loadOrders();
    this.loadShifts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMachines() {
    this.machineService.getMachines(1, 100).subscribe({
      next: (response) => {
        this.machines = response.items;
        this.machines.forEach(m => this.machineMap.set(m.machineId, m.machineName));
      }
    });
  }

  private loadOrders() {
    this.orderService.getOrders(1, 1000).subscribe({
      next: (response) => {
        this.orders = response.items;
        this.orders.forEach(o => this.orderMap.set(o.orderId, o.orderName));
      }
    });
  }

  getMachineName(machineId: string): string {
    return this.machineMap.get(machineId) || machineId;
  }

  getOrderName(orderId: string): string {
    return orderId ? (this.orderMap.get(orderId) || orderId) : 'No Order';
  }

  loadShifts(event?: any) {
    if (this.loading || !this.hasMore) {
      if (event) event.target.complete();
      return;
    }

    this.loading = true;
    this.shiftService.getProductionShifts(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.shifts = response.items;
        } else {
          this.shifts = [...this.shifts, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.showToast('Failed to load shifts', 'danger');
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value || '';
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.hasMore = true;
    this.shifts = [];
    this.loadShifts();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';
    this.performSearch('');
  }

  getShiftTypeLabel(shiftType: string): string {
    const types: Record<string, string> = { '1': 'Morning', '2': 'Evening', '3': 'Night' };
    return types[shiftType] || shiftType;
  }

  viewShift(id: number) {
    this.router.navigate(['/tabs/production-shift', id]);
  }

  createShift() {
    this.router.navigate(['/tabs/production-shift/create']);
  }

  editShift(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/tabs/production-shift', id, 'edit']);
  }

  async confirmDelete(shift: ProductionShift, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete shift "${shift.shiftId}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => this.deleteShift(shift) }
      ]
    });
    await alert.present();
  }

  deleteShift(shift: ProductionShift) {
    this.shiftService.deleteProductionShift(shift.shiftIdSeq).subscribe({
      next: () => {
        this.shifts = this.shifts.filter(s => s.shiftIdSeq !== shift.shiftIdSeq);
        this.showToast('Shift deleted successfully', 'success');
      },
      error: () => this.showToast('Failed to delete shift', 'danger')
    });
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
