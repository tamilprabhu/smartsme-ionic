import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
