import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { MachineService } from 'src/app/services/machine.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LookupItem, LookupSearchModalComponent } from 'src/app/components/lookup-search-modal/lookup-search-modal.component';
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
  orderSelection: LookupItem | null = null;
  productSelection: LookupItem | null = null;
  machineSelection: LookupItem | null = null;
  operator1Selection: LookupItem | null = null;
  operator2Selection: LookupItem | null = null;
  operator3Selection: LookupItem | null = null;
  supervisorSelection: LookupItem | null = null;

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
    private productService: ProductService,
    private employeeService: EmployeeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.hydrateLookups();
    this.hydrateSelections();
    if (this.readonly) {
      this.form.disable();
    }
  }

  private hydrateSelections() {
    this.resolveEmployeeSelection('operator1', ['PRODUCTION_EMPLOYEE']);
    this.resolveEmployeeSelection('operator2', ['PRODUCTION_EMPLOYEE']);
    this.resolveEmployeeSelection('operator3', ['PRODUCTION_EMPLOYEE']);
    this.resolveEmployeeSelection('supervisor', ['SHIFT_INCHARGE']);
  }

  private hydrateLookups() {
    this.resolveLookup('orderId', 'order');
    this.resolveLookup('productId', 'product');
    this.resolveLookup('machineId', 'machine');
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

  async openLookupModal(field: 'orderId' | 'productId' | 'machineId' | 'operator1' | 'operator2' | 'operator3' | 'supervisor') {
    if (this.readonly) {
      return;
    }
    const titleMap: Record<string, string> = {
      orderId: 'Select Order',
      productId: 'Select Product',
      machineId: 'Select Machine',
      operator1: 'Select Operator 1',
      operator2: 'Select Operator 2',
      operator3: 'Select Operator 3',
      supervisor: 'Select Supervisor'
    };
    const resourceMap: Record<string, 'order' | 'product' | 'machine' | 'employee'> = {
      orderId: 'order',
      productId: 'product',
      machineId: 'machine',
      operator1: 'employee',
      operator2: 'employee',
      operator3: 'employee',
      supervisor: 'employee'
    };
    const allowClear = field === 'orderId' || field === 'operator2' || field === 'operator3';
    const roleNames = resourceMap[field] === 'employee'
      ? (field === 'supervisor' ? ['SHIFT_INCHARGE'] : ['PRODUCTION_EMPLOYEE'])
      : [];

    const selectedValue = this.form.get(field)?.value ?? null;
    const modal = await this.modalController.create({
      component: LookupSearchModalComponent,
      componentProps: {
        title: titleMap[field],
        resource: resourceMap[field],
        selectedValue,
        allowClear,
        roleNames
      }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss<LookupItem | null>();

    if (role === 'select' && data) {
      this.form.get(field)?.setValue(data.value);
      this.setLookupSelection(field, data);
    }

    if (role === 'clear') {
      this.form.get(field)?.setValue(null);
      this.setLookupSelection(field, null);
    }
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

  getSelectionLabel(field: 'operator1' | 'operator2' | 'operator3' | 'supervisor'): string {
    const selection = this.getLookupSelection(field);
    if (selection?.label) {
      return selection.label;
    }
    const value = this.form.get(field)?.value;
    if (value) {
      return `${value}`;
    }
    return '';
  }

  getLookupLabel(field: 'orderId' | 'productId' | 'machineId'): string {
    const selection = this.getLookupSelection(field);
    if (selection?.label) {
      return selection.label;
    }
    const value = this.form.get(field)?.value;
    if (value) {
      return `${value}`;
    }
    return '';
  }

  private resolveEmployeeSelection(field: 'operator1' | 'operator2' | 'operator3' | 'supervisor', roleNames: string[]) {
    const value = this.form.get(field)?.value;
    if (!value) {
      return;
    }
    this.employeeService.getEmployeesByRole(roleNames, 1, 10, `${value}`).subscribe({
      next: (response) => {
        const match = response.items.find(item => item.value === value);
        if (match) {
          this.setLookupSelection(field, {
            value: match.value,
            label: match.label
          });
        }
      },
      error: (error) => console.error(`Failed to resolve ${field}`, error)
    });
  }

  private resolveLookup(field: 'orderId' | 'productId' | 'machineId', resource: 'order' | 'product' | 'machine') {
    const value = this.form.get(field)?.value;
    if (!value) {
      return;
    }
    const searchValue = `${value}`;
    if (resource === 'order') {
      this.orderService.getOrders(1, 10, searchValue).subscribe({
        next: (response) => {
          const match = response.items.find(item => item.orderId === value);
          if (match) {
            this.setLookupSelection(field, {
              value: match.orderId,
              label: `${match.orderName} (${match.orderId})`
            });
          }
        },
        error: (error) => console.error(`Failed to resolve ${field}`, error)
      });
      return;
    }
    if (resource === 'machine') {
      this.machineService.getMachines(1, 10, searchValue).subscribe({
        next: (response) => {
          const match = response.items.find(item => item.machineId === value);
          if (match) {
            this.setLookupSelection(field, {
              value: match.machineId,
              label: `${match.machineName} (${match.machineId})`
            });
          }
        },
        error: (error) => console.error(`Failed to resolve ${field}`, error)
      });
      return;
    }
    this.productService.getProducts(1, 10, searchValue).subscribe({
      next: (response) => {
        const match = response.items.find(item => item.prodId === value);
        if (match) {
          this.setLookupSelection(field, {
            value: match.prodId,
            label: `${match.prodName} (${match.prodId})`
          });
        }
      },
      error: (error) => console.error(`Failed to resolve ${field}`, error)
    });
  }

  private setLookupSelection(field: 'orderId' | 'productId' | 'machineId' | 'operator1' | 'operator2' | 'operator3' | 'supervisor', item: LookupItem | null) {
    if (field === 'orderId') {
      this.orderSelection = item;
    } else if (field === 'productId') {
      this.productSelection = item;
    } else if (field === 'machineId') {
      this.machineSelection = item;
    } else if (field === 'operator1') {
      this.operator1Selection = item;
    } else if (field === 'operator2') {
      this.operator2Selection = item;
    } else if (field === 'operator3') {
      this.operator3Selection = item;
    } else if (field === 'supervisor') {
      this.supervisorSelection = item;
    }
  }

  private getLookupSelection(field: 'orderId' | 'productId' | 'machineId' | 'operator1' | 'operator2' | 'operator3' | 'supervisor') {
    if (field === 'orderId') {
      return this.orderSelection;
    }
    if (field === 'productId') {
      return this.productSelection;
    }
    if (field === 'machineId') {
      return this.machineSelection;
    }
    if (field === 'operator1') {
      return this.operator1Selection;
    }
    if (field === 'operator2') {
      return this.operator2Selection;
    }
    if (field === 'operator3') {
      return this.operator3Selection;
    }
    return this.supervisorSelection;
  }
}
