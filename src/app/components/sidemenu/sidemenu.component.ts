import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidemenuComponent  implements OnInit {

  user: any = [];

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.getUserDetails();
  }


  

  logout() {
    this.loginService.logout();
  }

  getUserDetails() {
    this.user.name = 'John Doe';
    this.user.email = 'johncalabe@yahoo.in';
    this.user.phone = '+1 234 567 8901';
    this.user.address = '123 Main St, Anytown, USA';
    this.user.employeeCode = 'EMP001';
    this.user.photoURL = 'assets/images/default-avatar.jpg'
    // return this.loginService.getUserDetails();
  }

}
