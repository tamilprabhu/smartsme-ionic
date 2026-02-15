import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ServerValidationErrors, applyServerValidationErrors, clearServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-machine-process',
  templateUrl: './machine-process.component.html',
  styleUrls: ['./machine-process.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class MachineProcessComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: any = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};
  @Output() formSubmit = new EventEmitter<any>();

  processForm: FormGroup;
  isSubmitting = false;
  formLevelErrors: string[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.processForm = this.fb.group({
      machineId: ['', Validators.required],
      machineName: ['', Validators.required],
      workType: ['', Validators.required],
      shortName: [''],
      process: ['']
    });
  }

  ngOnInit() {
    Object.keys(this.processForm.controls).forEach((controlName) => {
      this.processForm.get(controlName)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.clearServerErrorForControl(controlName));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.processForm.patchValue(this.formData);
      if (this.mode === 'read') {
        this.processForm.disable();
      } else {
        this.processForm.enable();
      }
    } else if (this.mode === 'create') {
      this.processForm.reset();
      this.processForm.enable();
    }

    if (changes['formData'] || changes['mode']) {
      clearServerValidationErrors(this.processForm);
      this.formLevelErrors = [];
    }

    if (changes['serverValidationErrors']) {
      clearServerValidationErrors(this.processForm);
      this.formLevelErrors = [];

      if (this.serverValidationErrors && Object.keys(this.serverValidationErrors).length > 0) {
        const applyResult = applyServerValidationErrors(this.processForm, this.serverValidationErrors, {
          machineType: 'workType'
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

  goBack() {
    this.navCtrl.back();
  }

  hasServerError(controlName: string): boolean {
    const serverErrors = this.processForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) && serverErrors.length > 0;
  }

  getServerErrorMessages(controlName: string): string[] {
    const serverErrors = this.processForm.get(controlName)?.errors?.['server'];
    return Array.isArray(serverErrors) ? serverErrors : [];
  }

  submit() {
    if (this.mode === 'read') {
      return;
    }

    clearServerValidationErrors(this.processForm);
    this.formLevelErrors = [];

    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formSubmit.emit(this.processForm.value);
    this.isSubmitting = false;
  }

  private clearServerErrorForControl(controlName: string): void {
    const control = this.processForm.get(controlName);
    const existingErrors = control?.errors;

    if (!control || !existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, 'server')) {
      return;
    }

    const { server, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}
