import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductionEntry, ProductionShift } from 'src/app/models/production-shift.model';
import { ShiftType } from 'src/app/enums/shift-type.enum';

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
  @Output() formSubmit = new EventEmitter<ProductionShift>();
  @Output() formClosed = new EventEmitter<void>();

  shiftForm!: FormGroup;

  machines = ['Machine A', 'Machine B', 'Machine C'];
  workTypes = ['Shift', 'Hours'];
  shiftTypes = [
    { label: 'Morning', value: ShiftType.MORNING },
    { label: 'Evening', value: ShiftType.EVENING },
    { label: 'Night', value: ShiftType.NIGHT }
  ];
  shiftHours = ['6', '8', '12'];
  users = [
    { label: 'Operator1', value: 31 },
    { label: 'Operator2', value: 32 },
    { label: 'Operator3', value: 33 },
    { label: 'Supervisor1', value: 22 }
  ];

  constructor(private fb: FormBuilder) {
    const now = new Date();
    
    // Date: Local date only
    const todayLocal = now.toISOString().split('T')[0];
    
    // ✅ Time: FULL ISO DATETIME (required by ion-datetime time picker)
    const currentISOTime = now.getFullYear() + '-' +
  String(now.getMonth() + 1).padStart(2, '0') + '-' +
  String(now.getDate()).padStart(2, '0') + 'T' +
  String(now.getHours()).padStart(2, '0') + ':' +
  String(now.getMinutes()).padStart(2, '0') + ':' +
  String(now.getSeconds()).padStart(2, '0') + '.' +
  String(now.getMilliseconds()).padStart(3, '0');

    console.log('Current ISO Time:', currentISOTime);
    this.shiftForm = this.fb.group({
      machine: ['', Validators.required],
      workType: ['', Validators.required],
      shiftType: [''],
      shiftHours: [''],
      operator1: ['', Validators.required],
      operator2: [''],
      operator3: [''],
      supervisor: ['', Validators.required],
      shiftDate: [todayLocal],
      shiftStartTime: [currentISOTime, Validators.required]  // ✅ Full ISO
    });
  }

  ngOnInit() {
    this.onWorkTypeChange();
    this.shiftForm.get('workType')?.valueChanges.subscribe(() => this.onWorkTypeChange());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.shiftForm.patchValue(this.formData);
      if (this.mode === 'read') {
        this.shiftForm.disable();
      } else {
        this.shiftForm.enable();
      }
    } else if (this.mode === 'create') {
      this.resetForm();
      this.shiftForm.enable();
    }
  }

  resetForm() {
    const now = new Date();
    const currentTime = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + 'T' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0') + '.' +
      String(now.getMilliseconds()).padStart(3, '0');
    this.shiftForm.patchValue({
      shiftStartTime: currentTime  // Reset to current time
    });
  }

  get f() {
    return this.shiftForm.controls;
  }

  get isShiftTypeDisabled(): boolean {
    return this.shiftForm.get('shiftType')?.disabled ?? true;
  }

  get isShiftHoursDisabled(): boolean {
    return this.shiftForm.get('shiftHours')?.disabled ?? true;
  }

  get isFormInvalid(): boolean {
    return this.shiftForm.invalid;
  }

  onWorkTypeChange() {
    const workType = this.shiftForm.get('workType')?.value;
    const shiftTypeControl = this.shiftForm.get('shiftType');
    const shiftHoursControl = this.shiftForm.get('shiftHours');

    if (workType === 'Shift') {
      shiftTypeControl?.enable();
      shiftHoursControl?.disable();
    } else if (workType === 'Hours') {
      shiftHoursControl?.enable();
      shiftTypeControl?.disable();
    } else {
      shiftTypeControl?.disable();
      shiftHoursControl?.disable();
    }
    shiftTypeControl?.updateValueAndValidity();
    shiftHoursControl?.updateValueAndValidity();
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') {
      return;
    }
    if (this.shiftForm.valid) {
      // ✅ Get ALL values from FormGroup
      const formValue = this.shiftForm.getRawValue() as ProductionShift;
      this.formSubmit.emit(formValue);
    }
  }

  getFormattedDate(): string {
    const dateValue = this.shiftForm.get('shiftDate')?.value;
    if (!dateValue) return '';
    
    // ✅ Parse as local date (no timezone issues)
    const date = new Date(dateValue + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  onShiftDateChange(event: any) {
    const value = event.detail.value;
    this.shiftForm.get('shiftDate')?.setValue(value, { emitEvent: true });
  }

  getFormattedTime(): string {
    const timeValue = this.shiftForm.get('shiftStartTime')?.value;
    console.log('Raw Time Value:', timeValue);
    if (!timeValue) return '';
    
    // ✅ Extract and format ISO datetime to 12-hour display
    const date = new Date(timeValue);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  onShiftTimeChange(event: any) {
    const value = event.detail.value;  // Already ISO format from picker
    console.log('Selected Time ISO:', value);
    this.shiftForm.get('shiftStartTime')?.setValue(value, { emitEvent: true });
  }

}
