import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ItemsPerPage } from 'src/app/enums/items-per-page.enum';
import { Dispatch } from 'src/app/models/dispatch.model';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { DispatchUpsertPayload } from 'src/app/services/dispatch.service';
import {
    ServerValidationErrors,
    applyServerValidationErrors,
    clearServerValidationErrors,
} from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
    selector: 'app-dispatch',
    templateUrl: './dispatch.component.html',
    styleUrls: ['./dispatch.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent],
})
export class DispatchComponent implements OnInit, OnChanges, OnDestroy {
    @Input() mode: 'create' | 'read' | 'update' | null = 'create';
    @Input() formData: Dispatch | null = null;
    @Input() serverValidationErrors: ServerValidationErrors = {};

    @Output() formSubmit = new EventEmitter<DispatchUpsertPayload>();
    @Output() formClosed = new EventEmitter<void>();

    dispatchForm: FormGroup;
    formLevelErrors: string[] = [];
    orders: Order[] = [];
    products: Product[] = [];

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {
        this.dispatchForm = this.fb.group({
            dispatchId: [''],
            orderId: ['', [Validators.required]],
            productId: ['', [Validators.required]],
            dispatchDate: ['', [Validators.required]],
            quantity: [0, [Validators.required, Validators.min(1)]],
            noOfPacks: [0, [Validators.required, Validators.min(0)]],
            totalWeight: [0, [Validators.required, Validators.min(0)]],
            normalWeight: [0, [Validators.required, Validators.min(0)]],
            normsWeight: [0, [Validators.required, Validators.min(0)]],
        });
    }

    ngOnInit(): void {
        Object.keys(this.dispatchForm.controls).forEach((controlName) => {
            this.dispatchForm
                .get(controlName)
                ?.valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe(() => this.clearServerErrorForControl(controlName));
        });

        this.loadMasterData();

        if (this.formData) {
            this.patchForm(this.formData);
        }

        this.applyModeState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['formData'] || changes['mode']) {
            clearServerValidationErrors(this.dispatchForm);
            this.formLevelErrors = [];

            if (this.formData) {
                this.patchForm(this.formData);
            } else if (this.mode === 'create') {
                this.resetForm();
            }

            this.applyModeState();
        }

        if (changes['serverValidationErrors']) {
            clearServerValidationErrors(this.dispatchForm);
            this.formLevelErrors = [];

            if (
                this.serverValidationErrors &&
                Object.keys(this.serverValidationErrors).length > 0
            ) {
                const applyResult = applyServerValidationErrors(
                    this.dispatchForm,
                    this.serverValidationErrors,
                );
                this.formLevelErrors = Object.values(applyResult.unmapped).reduce<string[]>(
                    (all, messages) => [...all, ...messages],
                    [],
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get f() {
        return this.dispatchForm.controls;
    }

    onSubmit(): void {
        if (this.mode === 'read') return;

        clearServerValidationErrors(this.dispatchForm);
        this.formLevelErrors = [];

        if (this.dispatchForm.invalid) {
            this.dispatchForm.markAllAsTouched();
            focusAndScrollToFirstError();
            return;
        }

        const value = this.dispatchForm.getRawValue();
        this.formSubmit.emit({
            orderId: value.orderId,
            productId: value.productId,
            dispatchDate: value.dispatchDate,
            quantity: Number(value.quantity),
            noOfPacks: Number(value.noOfPacks),
            totalWeight: Number(value.totalWeight),
            normalWeight: Number(value.normalWeight),
            normsWeight: Number(value.normsWeight),
        });
    }

    goBack(): void {
        this.formClosed.emit();
    }

    hasServerError(controlName: string): boolean {
        const serverErrors = this.dispatchForm.get(controlName)?.errors?.['server'];
        return Array.isArray(serverErrors) && serverErrors.length > 0;
    }

    getServerErrorMessages(controlName: string): string[] {
        const serverErrors = this.dispatchForm.get(controlName)?.errors?.['server'];
        return Array.isArray(serverErrors) ? serverErrors : [];
    }

    private loadMasterData(): void {
        forkJoin({
            orders: this.orderService.getOrders(1, ItemsPerPage.MAX),
            products: this.productService.getProducts(1, ItemsPerPage.MAX),
        }).subscribe({
            next: ({ orders, products }) => {
                this.orders = orders.items;
                this.products = products.items;
            },
            error: () => {
                this.orders = [];
                this.products = [];
            },
        });
    }

    private patchForm(data: Dispatch): void {
        this.dispatchForm.patchValue(
            {
                dispatchId: data.dispatchId || '',
                orderId: data.orderId || '',
                productId: data.productId || '',
                dispatchDate: this.toDateInputValue(data.dispatchDate),
                quantity: Number(data.quantity ?? 0),
                noOfPacks: Number(data.noOfPacks ?? 0),
                totalWeight: Number(data.totalWeight ?? 0),
                normalWeight: Number(data.normalWeight ?? 0),
                normsWeight: Number(data.normsWeight ?? 0),
            },
            { emitEvent: false },
        );
    }

    private resetForm(): void {
        this.dispatchForm.reset(
            {
                dispatchId: '',
                orderId: '',
                productId: '',
                dispatchDate: '',
                quantity: 0,
                noOfPacks: 0,
                totalWeight: 0,
                normalWeight: 0,
                normsWeight: 0,
            },
            { emitEvent: false },
        );
    }

    private applyModeState(): void {
        if (this.mode === 'read') {
            this.dispatchForm.disable({ emitEvent: false });
            return;
        }

        this.dispatchForm.enable({ emitEvent: false });
        this.dispatchForm.get('dispatchId')?.disable({ emitEvent: false });
    }

    private clearServerErrorForControl(controlName: string): void {
        const control = this.dispatchForm.get(controlName);
        const existingErrors = control?.errors;

        if (
            !control ||
            !existingErrors ||
            !Object.prototype.hasOwnProperty.call(existingErrors, 'server')
        ) {
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

        return parsedDate.toISOString().slice(0, 16);
    }
}
