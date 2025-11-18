import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CompanyService } from '../../services/company.service';
import { Company } from 'src/app/models/company.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, FormsModule, IonicModule]
})
export class CompanyComponent implements OnInit {

  formData: Omit<Company, 'companyIdSeq' | 'createDate' | 'updateDate'> = {
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
    private companyService: CompanyService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      await this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating company...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isLoading = true;

    this.companyService.createCompany(this.formData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showToast('Company created successfully!', 'success');
        form.resetForm();
        this.resetFormData();
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        const message = error.error?.error || 'Failed to create company. Please try again.';
        await this.showToast(message, 'danger');
      }
    });
  }

  private resetFormData() {
    this.formData = {
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

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
