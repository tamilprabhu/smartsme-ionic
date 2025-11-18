import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { Location, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, FormsModule, IonicModule, CommonModule]
})
export class UsersComponent implements OnInit {

  formData: User = {
    username: 'admin',
    password: 'password123',
    userType: 'admin',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@smartsme.co.in',
    mobile: '+91 9876543210',
    address: '123 Main Street, Chennai, Tamil Nadu',
    gstin: 'GST123456789'
  };

  showGSTIN = false;

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  onUserTypeChange(event: any) {
    const userType = event.detail.value;
    this.showGSTIN = userType === 'seller' || userType === 'buyer';
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('User Form Data:', this.formData);
    } else {
      console.log('Form is invalid');
    }
  }
}
