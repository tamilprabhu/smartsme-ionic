import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class DateFieldComponent {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = 'Date';
  @Input() readonly: boolean = false;
  @Input() errorText: string = 'Date is required.';
  @Input() placeholder: string = 'Select date';
  @Input() useModal: boolean = false;
  @Input() presentation: 'date' | 'time' | 'date-time' = 'date';
  @Input() value?: string;
  @Input() displayValue?: string;
  @Input() triggerId: string = '';
  @Input() showButtons: boolean = true;
  @Input() modalCssClass: string = 'date-field-modal';
  @Input() min?: string;
  @Input() max?: string;

  @Output() valueChange = new EventEmitter<string>();

  get control() {
    return this.formGroup?.get(this.controlName);
  }

  get hasFormBinding(): boolean {
    return !!this.formGroup && !!this.controlName;
  }

  get showError(): boolean {
    const ctrl = this.control;
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched) && !this.readonly;
  }

  get currentValue(): string {
    if (this.hasFormBinding) {
      return this.control?.value || '';
    }
    return this.value || '';
  }

  get resolvedTriggerId(): string {
    if (this.triggerId) return this.triggerId;
    return `date-field-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  get displayText(): string {
    if (this.displayValue) return this.displayValue;
    const value = this.currentValue;
    if (!value) return '';
    let date: Date;
    if (this.presentation === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      date = new Date(`${value}T00:00:00`);
    } else if (this.presentation === 'time' && /^\d{2}:\d{2}/.test(value)) {
      const today = new Date();
      date = new Date(`${today.toISOString().split('T')[0]}T${value}`);
    } else {
      date = new Date(value);
    }
    if (Number.isNaN(date.getTime())) return value;
    if (this.presentation === 'time') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (this.presentation === 'date-time') {
      return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  onDateChange(event: any) {
    const value = event?.detail?.value || '';
    if (this.hasFormBinding && this.control) {
      this.control.setValue(value, { emitEvent: true });
    }
    this.valueChange.emit(value);
  }
}
