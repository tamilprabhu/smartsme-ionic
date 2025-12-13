import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Company } from 'src/app/models/company.model';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss'],
  standalone: false
})
export class CompanyManagementComponent {
  companies: Company[] = [];
  formMode: 'create' | 'read' | 'update' = 'create';
  selectedCompany: Company | null = null;
  showForm = false;

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    // Sample data for demo
    this.companies = [
      {
        companyId: 'COMP001',
        companyName: 'Acme Corp',
        businessCons: 'corporation',
        companyType: 'large scale',
        address: '123 Main St',
        pincode: 560001,
        propName: 'John Doe',
        directPhone: '1234567890',
        officePhone: '0987654321',
        mgmtPhone: '',
        mailId: 'info@acme.com',
        natureOfBusiness: 'manufacturing',
        authPerson: 'Jane Manager',
        mobileNo: '9876543210'
      }
    ];
  }

  openCreateForm() {
    this.selectedCompany = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(company: Company) {
    this.selectedCompany = company;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(company: Company) {
    this.selectedCompany = { ...company };
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(company: Company) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete "${company.companyName}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteCompany(company) }
      ]
    });
    await alert.present();
  }

  deleteCompany(company: Company) {
    this.companies = this.companies.filter(c => c.companyId !== company.companyId);
  }

  handleFormSubmit(formData: Company) {
    if (this.formMode === 'create') {
      this.companies.push(formData);
    } else if (this.formMode === 'update' && formData.companyId) {
      const index = this.companies.findIndex(c => c.companyId === formData.companyId);
      if (index > -1) this.companies[index] = formData;
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedCompany = null;
    this.formMode = 'create';
  }

  goBack() {
    this.navCtrl.back();
  }
}
