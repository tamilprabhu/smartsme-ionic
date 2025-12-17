import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operations',
  templateUrl: 'operations.page.html',
  styleUrls: ['operations.page.scss'],
  standalone: false,
})
export class OperationsPage {
  operations: Array<{ icon: string; title: string; subtitle: string }> = [];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('OperationsPage initialized');
    this.operations = [
      {
        icon: 'cube-outline',
        title: 'Stock Inward',
        subtitle: 'Manage incoming inventory'
      },
      {
        icon: 'clipboard-outline',
        title: 'Order',
        subtitle: 'Create and track orders'
      },
      {
        icon: 'construct-outline',
        title: 'Production Entry',
        subtitle: 'Log and monitor production'
      },
      {
        icon: 'document-text-outline',
        title: 'Invoice',
        subtitle: 'Generate and view invoices'
      },
      {
        icon: 'car-outline',
        title: 'Dispatch',
        subtitle: 'Schedule and track dispatch'
      },
    ];

  }


  navigateTo(operation: string) {
    console.log(`Navigating to operation: ${operation}`);
    if (operation === 'Production Entry') {
      this.router.navigate(['/tabs/production-shift']);
    } else if (operation === 'Dispatch') {
      this.router.navigate(['/tabs/dispatch-management']);
    } else if (operation === 'Stock Inward') {
      this.router.navigate(['/tabs/stock-management']);
    } else if (operation === 'Order') {
      this.router.navigate(['/tabs/order-management']);
    } else if (operation === 'Invoice') {
      this.router.navigate(['/tabs/invoice-management']);
    }
  }

}
