import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Seller } from 'src/app/models/seller.model';
import { SellerUpsertPayload } from 'src/app/services/seller.service';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
  selector: 'app-sellers',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class SellerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Seller | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};

  @Output() formSubmit = new EventEmitter<SellerUpsertPayload>();
  @Output() formClosed = new EventEmitter<void>();

  sellerForm: FormGroup;
  formLevelErrors: string[] = [];
  private readonly destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder) {
    this.sellerForm = this.fb.group({
      sellerId: [''],
      sellerName: ['', Validators.required],
      sellerAddress: ['', Validators.required],
      sellerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      sellerEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    Object.keys(this.sellerForm.controls).forEach((controlName) => {
      this.sellerForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });

    if (this.formData) {
      this.patchForm(this.formData);
    }

    this.applyModeState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.patchForm(this.formData);
      this.applyModeState();
    } else if (this.mode === 'create') {
      this.resetForm();
      this.applyModeState();
    }

    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.sellerForm);
      this.formLevelErrors = [];
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.sellerForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.sellerForm, this.serverValidationErrors, {
          sellerName: 'sellerName',
          sellerAddress: 'sellerAddress',
          sellerPhone: 'sellerPhone',
          sellerEmail: 'sellerEmail'
        });
        this.formLevelErrors = Object.values(applyResult.unmapped).reduce<string[]>(
          (allMessages, messages) => [...allMessages, ...messages],
          []
        );
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.sellerForm.controls;
  }

  patchForm(data: Seller) {
    this.sellerForm.patchValue({
      sellerId: data.sellerId || '',
      sellerName: data.sellerName || '',
      sellerAddress: data.sellerAddress || '',
      sellerPhone: data.sellerPhone || '',
      sellerEmail: data.sellerEmail || ''
    }, { emitEvent: false });
  }

  resetForm() {
    this.sellerForm.reset({
      sellerId: '',
      sellerName: '',
      sellerAddress: '',
      sellerPhone: '',
      sellerEmail: ''
    }, { emitEvent: false });
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') {
      return; // prevent submit in read mode
    }

    clearServerValidationErrors(this.sellerForm);
    this.formLevelErrors = [];

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      focusAndScrollToFirstError();
      return;
    }

    const value = this.sellerForm.getRawValue();
    const payload: SellerUpsertPayload = {
      sellerName: value.sellerName,
      sellerAddress: value.sellerAddress,
      sellerPhone: value.sellerPhone,
      sellerEmail: value.sellerEmail
    };
    this.formSubmit.emit(payload);
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.sellerForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.sellerForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.sellerForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  private applyModeState(): void {
    if (this.mode === 'read') {
      this.sellerForm.disable({ emitEvent: false });
      return;
    }

    this.sellerForm.enable({ emitEvent: false });
    this.sellerForm.get('sellerId')?.disable({ emitEvent: false });
  }
}
