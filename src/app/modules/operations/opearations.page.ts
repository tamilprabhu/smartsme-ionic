import { Component } from '@angular/core';

@Component({
  selector: 'app-operations',
  templateUrl: 'operations.page.html',
  styleUrls: ['operations.page.scss'],
  standalone: false,
})
export class OperationsPage {

  constructor() {}

  navigateTo(operation: string) {
    console.log(`Navigating to operation: ${operation}`);
    // Implement navigation logic here
  }

}
