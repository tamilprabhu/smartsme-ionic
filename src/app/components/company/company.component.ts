import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent]
})
export class CompanyComponent  implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    // window.history.back();
    this.location.back();
  }

}
