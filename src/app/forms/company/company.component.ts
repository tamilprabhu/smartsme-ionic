import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { Company } from 'src/app/models/company.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  imports: [FooterComponent, FormsModule, IonicModule, CommonModule]
})
export class CompanyComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' = 'create';
  @Input() formData: Partial<Company> | null = null;
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

  isLoading = false;

  constructor(
    private location: Location,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

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
    if (!form.valid) {
      await this.showToast('Please fill all required fields', 'warning');
      return;
    }

    this.isLoading = true;
    // Simulate async processing or optionally replace with real service call
    setTimeout(async () => {
      this.isLoading = false;
      await this.showToast(
        this.mode === 'create'
          ? 'Company created successfully!'
          : 'Company updated successfully!',
        'success'
      );
      this.formSubmit.emit({ ...this.model } as Company);
      form.resetForm();
      this.resetModel();
    }, 700);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
