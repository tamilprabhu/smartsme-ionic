import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from '../../components/footer/footer.component';
import { Buyer } from 'src/app/models/buyer.model';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class BuyerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Buyer | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};
  @Output() formSubmit = new EventEmitter<Buyer>();
  @Output() formClosed = new EventEmitter<void>();

  buyerForm: FormGroup;
  formLevelErrors: string[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private location: Location, private fb: FormBuilder) {
    this.buyerForm = this.fb.group({
      buyerId: ['', Validators.required],
      buyerName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gstin: ['']
    });
  }

  ngOnInit() {
    Object.keys(this.buyerForm.controls).forEach((controlName) => {
      this.buyerForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });

    if (this.formData) {
      this.buyerForm.patchValue(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.buyerForm.patchValue(this.formData);
      if (this.mode === 'read') {
        this.buyerForm.disable();
      } else {
        this.buyerForm.enable();
      }
    } else if (this.mode === 'create') {
      this.buyerForm.reset();
      this.buyerForm.enable();
    }

    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.buyerForm);
      this.formLevelErrors = [];
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.buyerForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.buyerForm, this.serverValidationErrors, {
          buyerAddress: 'address',
          buyerPhone: 'phone',
          buyerEmail: 'email',
          buyerGstin: 'gstin'
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
    return this.buyerForm.controls;
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') {
      return;
    }

    clearServerValidationErrors(this.buyerForm);
    this.formLevelErrors = [];

    if (this.buyerForm.invalid) {
      this.buyerForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.buyerForm.value);
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.buyerForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.buyerForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.buyerForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}
