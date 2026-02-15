import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { User } from 'src/app/models/user.model';
import { ServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, FormsModule, IonicModule, CommonModule]
})
export class UserComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' = 'create';
  @Input() formData: Partial<User> | null = null;
  @Input() serverValidationErrors: ServerValidationErrors = {};
  @Output() formSubmit = new EventEmitter<User>();
  @Output() formClosed = new EventEmitter<void>();

  model: User = {
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    createdDate: '',
    updatedDate: ''
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

  private patchModel(data: Partial<User>) {
    this.model = { ...this.model, ...data };
  }

  private resetModel() {
    this.model = {
      id: 0,
      username: '',
      firstName: '',
      lastName: '',
      name: '',
      email: '',
      mobile: '',
      address: '',
      password: '',
      createdDate: '',
      updatedDate: ''
    };
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit(form: NgForm) {
    if (this.mode === 'read') {
      return;
    }
    this.fieldServerErrors = {};
    this.formLevelErrors = [];

    if (!form.valid) {
      return;
    }

    this.formSubmit.emit({ ...this.model });
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
