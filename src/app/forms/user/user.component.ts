import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, FormsModule, IonicModule, CommonModule]
})
export class UserComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' = 'create';
  @Input() formData: Partial<User> | null = null;
  @Output() formSubmit = new EventEmitter<User>();
  @Output() formClosed = new EventEmitter<void>();

  // used by template [(ngModel)]
  model: User = {
    username: '',
    password: '',
    userType: 'admin',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    address: '',
    gstin: ''
  };

  showGSTIN = false;

  constructor(private location: Location) {}

  ngOnInit() {
    if (this.formData) {
      this.patchModel(this.formData);
    }
    this.updateGSTINVisibility(this.model.userType);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.patchModel(this.formData);
      this.updateGSTINVisibility(this.model.userType);
    }
    if (changes['mode'] && this.mode === 'create') {
      this.resetModel();
      this.updateGSTINVisibility(this.model.userType);
    }
  }

  private patchModel(data: Partial<User>) {
    this.model = { ...this.model, ...data };
  }

  private resetModel() {
    this.model = {
      username: '',
      password: '',
      userType: 'admin',
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      address: '',
      gstin: ''
    };
  }

  goBack() {
    this.formClosed.emit();
  }

  onUserTypeChange(event: any) {
    const userType = event.detail.value;
    this.model.userType = userType;
    this.updateGSTINVisibility(userType);
  }

  private updateGSTINVisibility(userType: string) {
    this.showGSTIN = userType === 'seller' || userType === 'buyer';
  }

  onSubmit(form: NgForm) {
    if (this.mode === 'read') {
      return;
    }
    if (!form.valid) {
      return;
    }
    this.formSubmit.emit({ ...this.model });
    form.resetForm();
    this.resetModel();
    this.updateGSTINVisibility(this.model.userType);
  }
}
