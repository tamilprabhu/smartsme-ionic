import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Seller } from 'src/app/models/seller.model';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';

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

  @Output() formSubmit = new EventEmitter<Seller>();
  @Output() formClosed = new EventEmitter<void>();

  sellerForm: FormGroup;
  formLevelErrors: string[] = [];
  private readonly destroy$ = new Subject<void>();
  isEdit = false;

  constructor(private location: Location, private fb: FormBuilder) {
    this.sellerForm = this.fb.group({
      sellerId: ['', Validators.required],
      sellerName: ['', Validators.required],
      address: [''],
      phone: ['', [Validators.pattern(/^[0-9\-\+ ]{7,}$/)]],
      email: ['', [Validators.email]],
      gstin: ['']
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.isEdit = this.mode === 'update';
      this.patchForm(this.formData);

      if (this.mode === 'read') {
        this.sellerForm.disable();
      } else {
        this.sellerForm.enable();
      }
    } else if (this.mode === 'create') {
      this.resetForm();
      this.sellerForm.enable();
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
          sellerAddress: 'address',
          sellerPhone: 'phone',
          sellerEmail: 'email'
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
    this.sellerForm.patchValue(data);
  }

  resetForm() {
    this.sellerForm.reset();
    this.isEdit = false;
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
      return;
    }

    this.formSubmit.emit(this.sellerForm.value);
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
}
