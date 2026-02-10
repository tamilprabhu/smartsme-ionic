import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { EntryType } from 'src/app/enums/entry-type.enum';
import { ShiftType } from 'src/app/enums/shift-type.enum';
import { ShiftHours } from 'src/app/enums/shift-hours.enum';

@Component({
  selector: 'app-production-entry',
  templateUrl: './production-entry.component.html',
  styleUrls: ['./production-entry.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FooterComponent
  ]
})
export class ProductionEntryComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: ProductionShift | null = null;
  @Output() formSubmit = new EventEmitter<Partial<ProductionShift>>();
  @Output() formClosed = new EventEmitter<void>();

  shiftForm!: FormGroup;

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

  constructor(private fb: FormBuilder) {
    this.shiftForm = this.fb.group({
      orderId: ['', Validators.required],
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
  }

  ngOnInit() {
    this.setupFormListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.populateForm(this.formData);
      if (this.mode === 'read') {
        this.shiftForm.disable();
      } else {
        this.shiftForm.enable();
        this.setupFormListeners();
      }
    } else if (this.mode === 'create') {
      this.shiftForm.reset({
        openingCount: 0,
        closingCount: 0,
        production: 0,
        rejection: 0,
        netProduction: 0,
        incentive: 'N'
      });
      this.shiftForm.enable();
    }
  }

  private populateForm(data: ProductionShift) {
    this.shiftForm.patchValue({
      orderId: data.orderId,
      productId: data.productId,
      machineId: data.machineId,
      shiftStartDate: data.shiftStartDate,
      shiftEndDate: data.shiftEndDate,
      entryType: data.entryType,
      shiftType: data.shiftType,
      shiftHours: data.shiftHours,
      operator1: data.operator1,
      operator2: data.operator2,
      operator3: data.operator3,
      supervisor: data.supervisor,
      openingCount: data.openingCount,
      closingCount: data.closingCount,
      production: data.production,
      rejection: data.rejection,
      netProduction: data.netProduction,
      incentive: data.incentive,
      less80Reason: data.less80Reason
    });
  }

  private setupFormListeners() {
    this.shiftForm.get('entryType')?.valueChanges.subscribe(() => this.onEntryTypeChange());
    this.shiftForm.get('production')?.valueChanges.subscribe(() => this.calculateNetProduction());
    this.shiftForm.get('rejection')?.valueChanges.subscribe(() => this.calculateNetProduction());
    this.onEntryTypeChange();
  }

  onEntryTypeChange() {
    const entryType = this.shiftForm.get('entryType')?.value;
    const shiftTypeControl = this.shiftForm.get('shiftType');
    const shiftHoursControl = this.shiftForm.get('shiftHours');

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
    const production = this.shiftForm.get('production')?.value || 0;
    const rejection = this.shiftForm.get('rejection')?.value || 0;
    const netProduction = production - rejection;
    this.shiftForm.get('netProduction')?.setValue(netProduction, { emitEvent: false });
  }

  get isShiftTypeRequired(): boolean {
    return this.shiftForm.get('entryType')?.value === EntryType.SHIFT.toString();
  }

  get isShiftHoursRequired(): boolean {
    return this.shiftForm.get('entryType')?.value === EntryType.HOURS.toString();
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') return;
    
    if (this.shiftForm.valid) {
      const formValue = this.shiftForm.getRawValue();
      this.formSubmit.emit(formValue);
    }
  }
}
