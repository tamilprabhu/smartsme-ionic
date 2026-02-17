import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Product } from 'src/app/models/product.model';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';

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
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() formClosed = new EventEmitter<void>();

  productForm: FormGroup;
  formLevelErrors: string[] = [];
  private readonly destroy$ = new Subject<void>();

  rawMaterials = ['Steel', 'Aluminum', 'Plastic', 'Copper']; // example options
  salesTypeOptions = ['Sales', 'Contract'];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      rawMaterial: ['', Validators.required],
      salesType: ['', Validators.required],
      salesCode: ['', Validators.required],
      salesPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
      weight: [0, [Validators.required, Validators.min(0)]],
      wastage: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      norms: [0, [Validators.required, Validators.min(0)]],
      totalWeight: [{ value: 0, disabled: true }],
      cavity: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      shotRate: [0, [Validators.required, Validators.min(0)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      incentiveLimit: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      productionShotQty: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      perHourProdQty: [0, [Validators.required, Validators.min(0)]]
    });

    // Watch weight and wastage to calculate totalWeight real-time
    this.productForm.get('weight')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalWeight());
    this.productForm.get('wastage')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalWeight());
  }

  ngOnInit() {
    Object.keys(this.productForm.controls).forEach((controlName) => {
      this.productForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });

    if (this.formData) {
      this.patchForm(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.patchForm(this.formData);
      if (this.mode === 'read') {
        this.productForm.disable();
      } else {
        this.productForm.enable();
      }
      this.updateTotalWeight();
    } else if (this.mode === 'create') {
      this.resetForm();
      this.productForm.enable();
    }

    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.productForm);
      this.formLevelErrors = [];
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.productForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.productForm, this.serverValidationErrors, {
          productId: 'productId',
          productName: 'productName',
          perItemRate: 'rate',
          salesPercent: 'salesPercentage'
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
    return this.productForm.controls;
  }

  patchForm(data: Product) {
    this.productForm.patchValue({
      productId: data.productId,
      productName: data.productName,
      rawMaterial: data.rawMaterial,
      salesType: data.salesType || '',
      salesCode: data.salesCode || '',
      salesPercentage: data.salesPercent ? Number(data.salesPercent) : 0,
      weight: data.weight,
      wastage: data.wastage,
      norms: data.norms,
      totalWeight: data.totalWeight,
      cavity: data.cavity,
      shotRate: data.shotRate,
      rate: data.perItemRate,
      incentiveLimit: data.incentiveLimit,
      productionShotQty: 0, // Default value
      perHourProdQty: 0 // Default value
    });
  }

  resetForm() {
    this.productForm.reset();
  }

  goBack() {
    this.formClosed.emit();
  }

  updateTotalWeight() {
    const weight = this.productForm.get('weight')?.value || 0;
    const wastage = this.productForm.get('wastage')?.value || 0;
    const totalWeight = weight * (1 + wastage / 100);
    this.productForm.get('totalWeight')?.setValue(totalWeight, { emitEvent: false });
  }

  onSubmit() {
    if (this.mode === 'read') return;

    clearServerValidationErrors(this.productForm);
    this.formLevelErrors = [];

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.getRawValue();
    
    // Map form fields to API structure
    const apiData = {
      prodSequence: this.formData?.prodSequence || 0,
      productId: formValue.productId,
      productName: formValue.productName,
      rawMaterial: formValue.rawMaterial,
      salesType: formValue.salesType,
      salesCode: formValue.salesCode,
      salesPercent: Number(formValue.salesPercentage).toFixed(2),
      weight: formValue.weight,
      wastage: formValue.wastage,
      norms: formValue.norms,
      totalWeight: formValue.totalWeight,
      cavity: formValue.cavity,
      shotRate: formValue.shotRate,
      perItemRate: formValue.rate,
      incentiveLimit: formValue.incentiveLimit,
      companyId: 'FINO001',
      createdAt: this.formData?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    this.formSubmit.emit(apiData);
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.productForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.productForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
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
