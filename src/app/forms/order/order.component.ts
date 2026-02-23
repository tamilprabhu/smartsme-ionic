import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Buyer } from 'src/app/models/buyer.model';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { ItemsPerPage } from 'src/app/enums/items-per-page.enum';
import { BuyerService } from 'src/app/services/buyer.service';
import { OrderUpsertPayload } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import {
  ServerValidationErrors,
  applyServerValidationErrors,
  clearServerValidationErrors
} from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class OrderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Order | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};

  @Output() formSubmit = new EventEmitter<OrderUpsertPayload>();
  @Output() formClosed = new EventEmitter<void>();

  orderForm: FormGroup;
  formLevelErrors: string[] = [];

  products: Product[] = [];
  buyers: Buyer[] = [];

  readonly orderStatuses = [
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly buyerService: BuyerService
  ) {
    this.orderForm = this.fb.group({
      orderId: [''],
      orderName: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      buyerId: ['', [Validators.required]],
      orderStatus: ['PENDING', [Validators.required]],
      orderDate: ['', [Validators.required]],
      targetDate: ['', [Validators.required]],
      orderQuantity: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    Object.keys(this.orderForm.controls).forEach((controlName) => {
      this.orderForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });

    this.orderForm.get('orderQuantity')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalPrice());
    this.orderForm.get('price')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalPrice());
    this.orderForm.get('discount')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTotalPrice());

    this.loadMasterData();

    if (this.formData) {
      this.patchForm(this.formData);
    }
    this.applyModeState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.orderForm);
      this.formLevelErrors = [];

      if (this.formData) {
        this.patchForm(this.formData);
      } else if (this.mode === 'create') {
        this.resetForm();
      }

      this.applyModeState();
      this.updateTotalPrice();
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.orderForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.orderForm, this.serverValidationErrors, {
          orderName: 'orderName',
          productId: 'productId',
          buyerId: 'buyerId',
          orderStatus: 'orderStatus',
          orderDate: 'orderDate',
          targetDate: 'targetDate',
          orderQuantity: 'orderQuantity',
          price: 'price',
          discount: 'discount',
          totalPrice: 'totalPrice'
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
    return this.orderForm.controls;
  }

  onSubmit(): void {
    if (this.mode === 'read') return;

    clearServerValidationErrors(this.orderForm);
    this.formLevelErrors = [];

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      focusAndScrollToFirstError();
      return;
    }

    const value = this.orderForm.getRawValue();
    const payload: OrderUpsertPayload = {
      orderName: value.orderName,
      productId: value.productId,
      buyerId: value.buyerId,
      orderStatus: value.orderStatus,
      orderDate: value.orderDate,
      targetDate: value.targetDate,
      orderQuantity: Number(value.orderQuantity),
      price: Number(value.price),
      discount: Number(value.discount),
      totalPrice: Number(value.totalPrice)
    };

    this.formSubmit.emit(payload);
  }

  goBack(): void {
    this.formClosed.emit();
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.orderForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.orderForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  private loadMasterData(): void {
    forkJoin({
      products: this.productService.getProducts(1, ItemsPerPage.MAX),
      buyers: this.buyerService.getBuyers(1, ItemsPerPage.MAX)
    }).subscribe({
      next: ({ products, buyers }) => {
        this.products = products.items;
        this.buyers = buyers.items;
      },
      error: () => {
        this.products = [];
        this.buyers = [];
      }
    });
  }

  private patchForm(data: Order): void {
    this.orderForm.patchValue({
      orderId: data.orderId || '',
      orderName: data.orderName || '',
      productId: data.productId || '',
      buyerId: data.buyerId || '',
      orderStatus: data.orderStatus || 'PENDING',
      orderDate: this.toDateInputValue(data.orderDate),
      targetDate: this.toDateInputValue(data.targetDate),
      orderQuantity: Number(data.orderQuantity ?? 0),
      price: Number(data.price ?? 0),
      discount: Number(data.discount ?? 0),
      totalPrice: Number(data.totalPrice ?? 0)
    }, { emitEvent: false });
  }

  private resetForm(): void {
    this.orderForm.reset({
      orderId: '',
      orderName: '',
      productId: '',
      buyerId: '',
      orderStatus: 'PENDING',
      orderDate: '',
      targetDate: '',
      orderQuantity: 0,
      price: 0,
      discount: 0,
      totalPrice: 0
    }, { emitEvent: false });
  }

  private applyModeState(): void {
    if (this.mode === 'read') {
      this.orderForm.disable({ emitEvent: false });
      return;
    }

    this.orderForm.enable({ emitEvent: false });
    this.orderForm.get('orderId')?.disable({ emitEvent: false });
    this.orderForm.get('totalPrice')?.disable({ emitEvent: false });
  }

  private updateTotalPrice(): void {
    const quantity = Number(this.orderForm.get('orderQuantity')?.value || 0);
    const price = Number(this.orderForm.get('price')?.value || 0);
    const discount = Number(this.orderForm.get('discount')?.value || 0);
    const totalPrice = Number((quantity * Math.max(price - discount, 0)).toFixed(2));
    this.orderForm.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.orderForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  private toDateInputValue(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }
}
