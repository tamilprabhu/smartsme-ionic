import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Buyer } from 'src/app/models/buyer.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Product } from 'src/app/models/product.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { InvoiceUpsertPayload } from 'src/app/services/invoice.service';
import { ProductService } from 'src/app/services/product.service';
import { ItemsPerPage } from 'src/app/enums/items-per-page.enum';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class InvoiceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Invoice | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};

  @Output() formSubmit = new EventEmitter<InvoiceUpsertPayload>();
  @Output() formClosed = new EventEmitter<void>();

  invoiceForm: FormGroup;
  formLevelErrors: string[] = [];
  buyers: Buyer[] = [];
  products: Product[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly buyerService: BuyerService,
    private readonly productService: ProductService
  ) {
    this.invoiceForm = this.fb.group({
      invoiceId: [''],
      invoiceDate: ['', [Validators.required]],
      buyerId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      cgstRate: [9, [Validators.required, Validators.min(0)]],
      cgstAmount: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      sgstRate: [9, [Validators.required, Validators.min(0)]],
      sgstAmount: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      totalAmount: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      sacCode: ['', [Validators.required]],
      buyrGstin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    Object.keys(this.invoiceForm.controls).forEach((controlName) => {
      this.invoiceForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.clearServerErrorForControl(controlName);
          this.recalculateTotals();
        });
    });

    this.loadMasterData();

    if (this.formData) {
      this.patchForm(this.formData);
    }

    this.applyModeState();
    this.recalculateTotals();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.invoiceForm);
      this.formLevelErrors = [];

      if (this.formData) {
        this.patchForm(this.formData);
      } else if (this.mode === 'create') {
        this.resetForm();
      }

      this.applyModeState();
      this.recalculateTotals();
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.invoiceForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.invoiceForm, this.serverValidationErrors);
        this.formLevelErrors = Object.values(applyResult.unmapped).reduce<string[]>((all, messages) => [...all, ...messages], []);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.invoiceForm.controls;
  }

  onSubmit(): void {
    if (this.mode === 'read') return;

    clearServerValidationErrors(this.invoiceForm);
    this.formLevelErrors = [];

    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      focusAndScrollToFirstError();
      return;
    }

    const value = this.invoiceForm.getRawValue();
    this.formSubmit.emit({
      invoiceDate: value.invoiceDate,
      buyerId: value.buyerId,
      productId: value.productId,
      quantity: Number(value.quantity),
      unitPrice: Number(value.unitPrice),
      cgstRate: Number(value.cgstRate),
      cgstAmount: Number(value.cgstAmount),
      sgstRate: Number(value.sgstRate),
      sgstAmount: Number(value.sgstAmount),
      totalAmount: Number(value.totalAmount),
      sacCode: value.sacCode,
      buyrGstin: value.buyrGstin
    });
  }

  goBack(): void {
    this.formClosed.emit();
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.invoiceForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.invoiceForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  private loadMasterData(): void {
    forkJoin({
      buyers: this.buyerService.getBuyers(1, ItemsPerPage.MAX),
      products: this.productService.getProducts(1, ItemsPerPage.MAX)
    }).subscribe({
      next: ({ buyers, products }) => {
        this.buyers = buyers.items;
        this.products = products.items;
      },
      error: () => {
        this.buyers = [];
        this.products = [];
      }
    });
  }

  private recalculateTotals(): void {
    const quantity = Number(this.invoiceForm.get('quantity')?.value || 0);
    const unitPrice = Number(this.invoiceForm.get('unitPrice')?.value || 0);
    const cgstRate = Number(this.invoiceForm.get('cgstRate')?.value || 0);
    const sgstRate = Number(this.invoiceForm.get('sgstRate')?.value || 0);

    const taxableAmount = quantity * unitPrice;
    const cgstAmount = Number(((taxableAmount * cgstRate) / 100).toFixed(2));
    const sgstAmount = Number(((taxableAmount * sgstRate) / 100).toFixed(2));
    const totalAmount = Number((taxableAmount + cgstAmount + sgstAmount).toFixed(2));

    this.invoiceForm.get('cgstAmount')?.setValue(cgstAmount, { emitEvent: false });
    this.invoiceForm.get('sgstAmount')?.setValue(sgstAmount, { emitEvent: false });
    this.invoiceForm.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });
  }

  private patchForm(data: Invoice): void {
    this.invoiceForm.patchValue({
      invoiceId: data.invoiceId || '',
      invoiceDate: this.toDateInputValue(data.invoiceDate),
      buyerId: data.buyerId || '',
      productId: data.productId || '',
      quantity: Number(data.quantity ?? 0),
      unitPrice: Number(data.unitPrice ?? 0),
      cgstRate: Number(data.cgstRate ?? 0),
      cgstAmount: Number(data.cgstAmount ?? 0),
      sgstRate: Number(data.sgstRate ?? 0),
      sgstAmount: Number(data.sgstAmount ?? 0),
      totalAmount: Number(data.totalAmount ?? 0),
      sacCode: data.sacCode || '',
      buyrGstin: data.buyrGstin || ''
    }, { emitEvent: false });
  }

  private resetForm(): void {
    this.invoiceForm.reset({
      invoiceId: '',
      invoiceDate: '',
      buyerId: '',
      productId: '',
      quantity: 0,
      unitPrice: 0,
      cgstRate: 9,
      cgstAmount: 0,
      sgstRate: 9,
      sgstAmount: 0,
      totalAmount: 0,
      sacCode: '',
      buyrGstin: ''
    }, { emitEvent: false });
  }

  private applyModeState(): void {
    if (this.mode === 'read') {
      this.invoiceForm.disable({ emitEvent: false });
      return;
    }

    this.invoiceForm.enable({ emitEvent: false });
    this.invoiceForm.get('invoiceId')?.disable({ emitEvent: false });
    this.invoiceForm.get('cgstAmount')?.disable({ emitEvent: false });
    this.invoiceForm.get('sgstAmount')?.disable({ emitEvent: false });
    this.invoiceForm.get('totalAmount')?.disable({ emitEvent: false });
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.invoiceForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  private toDateInputValue(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return String(value);
    }

    return parsedDate.toISOString().slice(0, 10);
  }
}
