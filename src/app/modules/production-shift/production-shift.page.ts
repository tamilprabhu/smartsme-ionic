import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MachineService, Machine } from '../../services/machine.service';
import { ProductService, Product } from '../../services/product.service';
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
      next: (products) => this.products = products,
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
}
