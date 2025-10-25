import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, FormsModule, IonicModule]
})
export class CompanyComponent implements OnInit {

  formData = {
    businessCons: 'Smart SME DieCasting Pvt Ltd',
    companyType: 'Manufacturing',
    address: '45 Ambattur Industrial Estate, Ambattur, Chennai, Tamil Nadu',
    pincode: '600058',
    propName: 'Tamil Selvan',
    directPhone: '+91 9876543210',
    officePhone: '044-26581234',
    managementPhone: '+91 9123456789',
    mailId: 'info@smartsme.co.in',
    natureOfBusiness: 'Die Casting & Automotive Components',
    authPerson: 'Nandha Kumar Viswanathan',
    mobileNo: '+91 9988776655'
  };

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Company Form Data:', this.formData);
    } else {
      console.log('Form is invalid');
    }
  }
}
