import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Company } from 'src/app/models/company.model';
import { ServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  imports: [FooterComponent, FormsModule, IonicModule, CommonModule]
})
export class CompanyComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' = 'create';
  @Input() formData: Partial<Company> | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};
  @Output() formSubmit = new EventEmitter<Company>();
  @Output() formClosed = new EventEmitter<void>();

  // Internal state for form binding
  model: Omit<Company, 'companyIdSeq' | 'createDate' | 'updateDate'> = {
    companyId: '',
    companyName: '',
    businessCons: 'corporation',
    companyType: 'medium scale',
    address: '',
    pincode: 0,
    propName: '',
    directPhone: '',
    officePhone: '',
    mgmtPhone: '',
    mailId: '',
    natureOfBusiness: 'manufacturing',
    authPerson: '',
    mobileNo: ''
  };

  fieldServerErrors: ServerValidationErrors = {};
  formLevelErrors: string[] = [];

  constructor(private location: Location) {}

  ngOnInit() {
    if (this.formData) {
      this.patchModel(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes detected in CompanyComponent:', changes);
    if (changes['formData'] && this.formData) {
      this.patchModel(this.formData);
    }
    if (changes['mode'] && this.mode === 'create') {
      this.resetModel();
    }
    if (changes['formData'] || changes['mode']) {
      this.fieldServerErrors = {};
      this.formLevelErrors = [];
    }
    if (changes['serverValidationErrors']) {
      this.applyServerValidationErrors();
    }
  }

  // Patch model for ngModel usage
  private patchModel(data: Partial<Company>) {
    this.model = { ...this.model, ...data };
  }

  private resetModel() {
    this.model = {
      companyId: '',
      companyName: '',
      businessCons: 'corporation',
      companyType: 'medium scale',
      address: '',
      pincode: 0,
      propName: '',
      directPhone: '',
      officePhone: '',
      mgmtPhone: '',
      mailId: '',
      natureOfBusiness: 'manufacturing',
      authPerson: '',
      mobileNo: ''
    };
  }

  goBack() {
    this.formClosed.emit();
  }

  onCancel() {
    this.formClosed.emit();
  }

  async onSubmit(form: NgForm) {
    if (this.mode === 'read') return;
    this.fieldServerErrors = {};
    this.formLevelErrors = [];

    if (!form.valid) {
      return;
    }

    this.formSubmit.emit({ ...this.model } as Company);
  }

  hasServerError(field: string): boolean {
    return (this.fieldServerErrors[field] ?? []).length > 0;
  }

  getServerErrorMessages(field: string): string[] {
    return this.fieldServerErrors[field] ?? [];
  }

  clearServerError(field: string): void {
    if (!this.hasServerError(field)) {
      return;
    }

    const { [field]: _, ...rest } = this.fieldServerErrors;
    this.fieldServerErrors = rest;
  }

  private applyServerValidationErrors(): void {
    const mappedErrors: ServerValidationErrors = {};
    const unmappedErrors: string[] = [];

    Object.entries(this.serverValidationErrors ?? {}).forEach(([field, messages]) => {
      if (this.model.hasOwnProperty(field)) {
        mappedErrors[field] = messages;
      } else {
        unmappedErrors.push(...messages);
      }
    });

    this.fieldServerErrors = mappedErrors;
    this.formLevelErrors = unmappedErrors;
  }
}
