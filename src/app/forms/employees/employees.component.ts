import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent]
})
export class EmployeesComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

}
