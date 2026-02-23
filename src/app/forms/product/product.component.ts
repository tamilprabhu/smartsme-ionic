import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Product } from 'src/app/models/product.model';
import { ProductUpsertPayload } from 'src/app/services/product.service';
import {
  ServerValidationErrors,
  applyServerValidationErrors,
  clearServerValidationErrors
} from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Product | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};

  @Output() formSubmit = new EventEmitter<ProductUpsertPayload>();
  @Output() formClosed = new EventEmitter<void>();

  productForm: FormGroup;
  formLevelErrors: string[] = [];

  rawMaterials = ['Steel', 'Aluminum', 'Plastic', 'Copper'];
  salesTypeOptions = ['Sales', 'Contract'];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) {
    this.productForm = this.fb.group({
      productId: [''],
      productName: ['', [Validators.required]],
      rawMaterial: ['', [Validators.required]],
      salesType: ['', [Validators.required]],
      salesCode: ['', [Validators.required]],
      salesPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      wastage: [0, [Validators.required, Validators.min(0)]],
      norms: [0, [Validators.required, Validators.min(0)]],
      totalWeight: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      cavity: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      shotRate: [0, [Validators.required, Validators.min(0)]],
      perItemRate: [0, [Validators.required, Validators.min(0)]],
      incentiveLimit: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    Object.keys(this.productForm.controls).forEach((controlName) => {
      this.productForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });

    this.productForm.get('weight')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalWeight());

    this.productForm.get('wastage')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalWeight());

    if (this.formData) {
      this.patchForm(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.productForm);
      this.formLevelErrors = [];

      if (this.formData) {
        this.patchForm(this.formData);
      } else if (this.mode === 'create') {
        this.resetForm();
      }

      this.applyModeState();
      this.updateTotalWeight();
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.productForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.productForm, this.serverValidationErrors, {
          productName: 'productName'
        });

        this.formLevelErrors = Object.values(applyResult.unmapped).reduce<string[]>(
          (allMessages, messages) => [...allMessages, ...messages],
          []
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    if (this.mode === 'read') return;

    clearServerValidationErrors(this.productForm);
    this.formLevelErrors = [];

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      focusAndScrollToFirstError();
      return;
    }

    const value = this.productForm.getRawValue();
    const payload: ProductUpsertPayload = {
      productName: value.productName,
      rawMaterial: value.rawMaterial,
      salesType: value.salesType,
      salesCode: value.salesCode,
      salesPercent: Number(value.salesPercent),
      weight: Number(value.weight),
      wastage: Number(value.wastage),
      norms: Number(value.norms),
      totalWeight: Number(value.totalWeight),
      cavity: Number(value.cavity),
      shotRate: Number(value.shotRate),
      perItemRate: Number(value.perItemRate),
      incentiveLimit: Number(value.incentiveLimit)
    };

    this.formSubmit.emit(payload);
  }

  goBack(): void {
    this.formClosed.emit();
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.productForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.productForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  private patchForm(data: Product): void {
    this.productForm.patchValue({
      productId: data.productId || '',
      productName: data.productName || '',
      rawMaterial: data.rawMaterial || '',
      salesType: data.salesType || '',
      salesCode: data.salesCode || '',
      salesPercent: Number(data.salesPercent ?? 0),
      weight: Number(data.weight ?? 0),
      wastage: Number(data.wastage ?? 0),
      norms: Number(data.norms ?? 0),
      totalWeight: Number(data.totalWeight ?? 0),
      cavity: Number(data.cavity ?? 0),
      shotRate: Number(data.shotRate ?? 0),
      perItemRate: Number(data.perItemRate ?? 0),
      incentiveLimit: Number(data.incentiveLimit ?? 0)
    }, { emitEvent: false });
  }

  private resetForm(): void {
    this.productForm.reset({
      productId: '',
      productName: '',
      rawMaterial: '',
      salesType: '',
      salesCode: '',
      salesPercent: 0,
      weight: 0,
      wastage: 0,
      norms: 0,
      totalWeight: 0,
      cavity: 0,
      shotRate: 0,
      perItemRate: 0,
      incentiveLimit: 0
    }, { emitEvent: false });
  }

  private applyModeState(): void {
    if (this.mode === 'read') {
      this.productForm.disable({ emitEvent: false });
      return;
    }

    this.productForm.enable({ emitEvent: false });
    this.productForm.get('productId')?.disable({ emitEvent: false });
    this.productForm.get('totalWeight')?.disable({ emitEvent: false });
  }

  private updateTotalWeight(): void {
    const weight = Number(this.productForm.get('weight')?.value || 0);
    const wastage = Number(this.productForm.get('wastage')?.value || 0);
    const totalWeight = Number((weight * (1 + wastage / 100)).toFixed(4));
    this.productForm.get('totalWeight')?.setValue(totalWeight, { emitEvent: false });
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.productForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}
