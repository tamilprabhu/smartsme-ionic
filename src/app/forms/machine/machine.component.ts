import { CommonModule } from '@angular/common';
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Machine } from 'src/app/models/machine.model';
import { MachineUpsertPayload } from 'src/app/services/machine.service';
import {
    ServerValidationErrors,
    applyServerValidationErrors,
    clearServerValidationErrors,
} from 'src/app/utils/server-validation.util';
import { focusAndScrollToFirstError } from 'src/app/utils/form-error-focus.util';

@Component({
    selector: 'app-machine',
    templateUrl: './machine.component.html',
    styleUrls: ['./machine.component.scss'],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent],
})
export class MachineComponent implements OnInit, OnChanges, OnDestroy {
    @Input() mode: 'create' | 'read' | 'update' | null = 'create';
    @Input() formData: Machine | null = null;
    @Input() serverValidationErrors: ServerValidationErrors = {};

    @Output() formSubmit = new EventEmitter<MachineUpsertPayload>();
    @Output() formClosed = new EventEmitter<void>();

    machineForm: FormGroup;
    isSubmitting = false;
    formLevelErrors: string[] = [];
    private readonly destroy$ = new Subject<void>();

    activeFlagOptions: Array<'Y' | 'N'> = ['Y', 'N'];

    constructor(private readonly fb: FormBuilder) {
        this.machineForm = this.fb.group({
            machineId: [''],
            machineName: ['', Validators.required],
            machineType: ['', Validators.required],
            capacity: ['', Validators.required],
            model: ['', Validators.required],
            activeFlag: ['Y', Validators.required],
        });
    }

    ngOnInit(): void {
        Object.keys(this.machineForm.controls).forEach((controlName) => {
            this.machineForm
                .get(controlName)
                ?.valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe(() => this.clearServerErrorForControl(controlName));
        });

        if (this.formData) {
            this.patchForm(this.formData);
        }

        this.applyModeState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['formData'] || changes['mode']) {
            clearServerValidationErrors(this.machineForm);
            this.formLevelErrors = [];

            if (this.formData) {
                this.patchForm(this.formData);
            } else if (this.mode === 'create') {
                this.resetForm();
            }

            this.applyModeState();
        }

        if (changes['serverValidationErrors']) {
            clearServerValidationErrors(this.machineForm);
            this.formLevelErrors = [];

            if (
                this.serverValidationErrors &&
                Object.keys(this.serverValidationErrors).length > 0
            ) {
                const applyResult = applyServerValidationErrors(
                    this.machineForm,
                    this.serverValidationErrors,
                );
                this.formLevelErrors = Object.values(applyResult.unmapped).reduce<string[]>(
                    (allMessages, messages) => [...allMessages, ...messages],
                    [],
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    hasServerError(controlName: string): boolean {
        const serverErrors = this.machineForm.get(controlName)?.errors?.['server'];
        return Array.isArray(serverErrors) && serverErrors.length > 0;
    }

    getServerErrorMessages(controlName: string): string[] {
        const serverErrors = this.machineForm.get(controlName)?.errors?.['server'];
        return Array.isArray(serverErrors) ? serverErrors : [];
    }

    submit(): void {
        if (this.mode === 'read') {
            return;
        }

        clearServerValidationErrors(this.machineForm);
        this.formLevelErrors = [];

        if (this.machineForm.invalid) {
            this.machineForm.markAllAsTouched();
            focusAndScrollToFirstError();
            return;
        }

        this.isSubmitting = true;

        const value = this.machineForm.getRawValue();
        const payload: MachineUpsertPayload = {
            machineName: value.machineName,
            machineType: value.machineType,
            capacity: value.capacity,
            model: value.model,
            activeFlag: value.activeFlag,
        };

        this.formSubmit.emit(payload);
        this.isSubmitting = false;
    }

    goBack(): void {
        this.formClosed.emit();
    }

    private patchForm(data: Machine): void {
        this.machineForm.patchValue(
            {
                machineId: data.machineId || '',
                machineName: data.machineName || '',
                machineType: data.machineType || '',
                capacity: data.capacity || '',
                model: data.model || '',
                activeFlag: data.activeFlag || 'Y',
            },
            { emitEvent: false },
        );
    }

    private resetForm(): void {
        this.machineForm.reset(
            {
                machineId: '',
                machineName: '',
                machineType: '',
                capacity: '',
                model: '',
                activeFlag: 'Y',
            },
            { emitEvent: false },
        );
    }

    private applyModeState(): void {
        if (this.mode === 'read') {
            this.machineForm.disable({ emitEvent: false });
            return;
        }

        this.machineForm.enable({ emitEvent: false });
        this.machineForm.get('machineId')?.disable({ emitEvent: false });
    }

    private clearServerErrorForControl(controlName: string): void {
        const control = this.machineForm.get(controlName);
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
}
