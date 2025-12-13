import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MachineService, Machine } from '../../services/machine.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { OrderService, Order } from '../../services/order.service';
import { ProductionShiftService, ProductionShift } from '../../services/production-shift.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-production-shift',
  templateUrl: 'production-shift.page.html',
  styleUrls: ['production-shift.page.scss'],
  standalone: false,
})
export class ProductionShiftPage implements OnInit {
  machines: Machine[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  users: User[] = [];
  
  formData: Partial<ProductionShift> = {
    orderId: '',
    machineId: '',
    shiftType: '1',
    shiftStartDate: '',
    shiftEndDate: '',
    entryType: 'shift',
    operator1: 0,
    operator2: 0,
    supervisor: 0,
    openingCount: 0,
    closingCount: 0,
    production: 0,
    rejection: 0,
    incentive: 'Y',
    less80Reason: ''
  };

  shiftStartDisplay = '';
  shiftEndDisplay = '';

  constructor(
    private location: Location,
    private machineService: MachineService,
    private productService: ProductService,
    private orderService: OrderService,
    private productionShiftService: ProductionShiftService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadMachines();
    this.loadProducts();
    this.loadOrders();
    this.loadUsers();
  }

  goBack() {
    this.location.back();
  }

  loadMachines() {
    this.machineService.getMachines().subscribe({
      next: (machines) => this.machines = machines,
      error: (error) => console.error('Error loading machines:', error)
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => this.products = response.items,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Production Shift Form Data:', this.formData);
    }
  }

  onShiftStartChange(ev: any) {
    const iso = ev.detail.value;        // e.g. 2025-12-01T12:50:00.000Z
    this.formData.shiftStartDate = iso;

    // Format for display; adapt to your needs
    const d = new Date(iso);
    this.shiftStartDisplay = d.toLocaleString(); // or custom pipe/format
  }

  onShiftEndChange(ev: any) {
    const iso = ev.detail.value;
    this.formData.shiftEndDate = iso;

    const d = new Date(iso);
    this.shiftEndDisplay = d.toLocaleString();
  }
}
