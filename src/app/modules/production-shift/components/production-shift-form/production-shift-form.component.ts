import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { Machine } from 'src/app/models/machine.model';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { MachineService } from 'src/app/services/machine.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { EntryType } from 'src/app/enums/entry-type.enum';
import { ShiftType } from 'src/app/enums/shift-type.enum';
import { ShiftHours } from 'src/app/enums/shift-hours.enum';

@Component({
  selector: 'app-production-shift-form',
  templateUrl: './production-shift-form.component.html',
  styleUrls: ['./production-shift-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ProductionShiftFormComponent implements OnInit {
  @Input() initialData: ProductionShift | null = null;
  @Input() readonly = false;
  @Output() formSubmit = new EventEmitter<Partial<ProductionShift>>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  machines: Machine[] = [];
  orders: Order[] = [];
  products: Product[] = [];

  entryTypes = [
    { label: 'Shift', value: EntryType.SHIFT.toString() },
    { label: 'Hours', value: EntryType.HOURS.toString() }
  ];

  shiftTypes = [
    { label: 'Morning', value: ShiftType.MORNING.toString() },
    { label: 'Evening', value: ShiftType.EVENING.toString() },
    { label: 'Night', value: ShiftType.NIGHT.toString() }
  ];

  shiftHoursOptions = [
    { label: '6 Hours', value: ShiftHours.SIX },
    { label: '8 Hours', value: ShiftHours.EIGHT },
    { label: '12 Hours', value: ShiftHours.TWELVE }
  ];

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadMachines();
    this.loadOrders();
    this.loadProducts();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    if (this.readonly) {
      this.form.disable();
    }
  }

  private loadMachines() {
    this.machineService.getMachines(1, 100).subscribe({
      next: (response) => {
        this.machines = response.items;
      },
      error: (error) => console.error('Failed to load machines', error)
    });
  }

  private loadOrders() {
    this.orderService.getOrders(1, 1000).subscribe({
      next: (response) => {
        this.orders = response.items;
      },
      error: (error) => console.error('Failed to load orders', error)
    });
  }

  private loadProducts() {
    this.productService.getProducts(1, 1000).subscribe({
      next: (response) => {
        this.products = response.items;
      },
      error: (error) => console.error('Failed to load products', error)
    });
  }

  private initForm() {
    this.form = this.fb.group({
      orderId: [''],
      productId: ['', Validators.required],
      machineId: ['', Validators.required],
      shiftStartDate: ['', Validators.required],
      shiftEndDate: ['', Validators.required],
      entryType: ['', Validators.required],
      shiftType: [''],
      shiftHours: [''],
      operator1: ['', Validators.required],
      operator2: [''],
      operator3: [''],
      supervisor: ['', Validators.required],
      openingCount: [0, [Validators.required, Validators.min(0)]],
      closingCount: [0, [Validators.required, Validators.min(0)]],
      production: [0, [Validators.required, Validators.min(0)]],
      rejection: [0, [Validators.required, Validators.min(0)]],
      netProduction: [0, [Validators.required, Validators.min(0)]],
      incentive: ['N', Validators.required],
      less80Reason: ['']
    });

    this.form.get('entryType')?.valueChanges.subscribe(() => this.onEntryTypeChange());
    this.form.get('production')?.valueChanges.subscribe(() => this.calculateNetProduction());
    this.form.get('rejection')?.valueChanges.subscribe(() => this.calculateNetProduction());
  }

  onEntryTypeChange() {
    const entryType = this.form.get('entryType')?.value;
    const shiftTypeControl = this.form.get('shiftType');
    const shiftHoursControl = this.form.get('shiftHours');

    if (entryType === EntryType.SHIFT.toString()) {
      shiftTypeControl?.setValidators([Validators.required]);
      shiftHoursControl?.clearValidators();
      shiftHoursControl?.setValue('');
    } else if (entryType === EntryType.HOURS.toString()) {
      shiftHoursControl?.setValidators([Validators.required]);
      shiftTypeControl?.clearValidators();
      shiftTypeControl?.setValue('');
    } else {
      shiftTypeControl?.clearValidators();
      shiftHoursControl?.clearValidators();
    }
    
    shiftTypeControl?.updateValueAndValidity();
    shiftHoursControl?.updateValueAndValidity();
  }

  calculateNetProduction() {
    const production = this.form.get('production')?.value || 0;
    const rejection = this.form.get('rejection')?.value || 0;
    this.form.get('netProduction')?.setValue(production - rejection, { emitEvent: false });
  }

  get isShiftTypeRequired(): boolean {
    return this.form.get('entryType')?.value === EntryType.SHIFT.toString();
  }

  get isShiftHoursRequired(): boolean {
    return this.form.get('entryType')?.value === EntryType.HOURS.toString();
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
