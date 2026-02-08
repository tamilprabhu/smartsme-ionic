import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-date-field-modal',
  templateUrl: './date-field-modal.component.html',
  styleUrls: ['./date-field-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DateFieldModalComponent {
  @Input() label: string = 'Date';
  @Input() value: string = '';
  @Input() displayValue: string = '';
  @Input() placeholder: string = 'Select date';
  @Input() triggerId: string = '';
  @Input() presentation: 'date' | 'time' | 'date-time' = 'date';
  @Input() showButtons: boolean = true;
  @Input() modalCssClass: string = 'report-datetime-modal';

  @Output() valueChange = new EventEmitter<string>();

  get resolvedTriggerId(): string {
    if (this.triggerId) return this.triggerId;
    return `date-field-${this.label.replace(/\s+/g, '-').toLowerCase()}`;
  }

  get displayText(): string {
    if (this.displayValue) return this.displayValue;
    if (!this.value) return '';
    const date = /^\d{4}-\d{2}-\d{2}$/.test(this.value)
      ? new Date(`${this.value}T00:00:00`)
      : new Date(this.value);
    if (Number.isNaN(date.getTime())) return this.value;
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
    this.valueChange.emit(value);
  }
}
