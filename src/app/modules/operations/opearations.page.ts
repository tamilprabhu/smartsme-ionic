import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface OperationItem {
  icon: string;
  title: string;
  subtitle: string;
  summary: string;
}

@Component({
  selector: 'app-operations',
  templateUrl: 'operations.page.html',
  styleUrls: ['operations.page.scss'],
  standalone: false,
})
export class OperationsPage {
  operations: OperationItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('OperationsPage initialized');
    this.operations = [
      {
        icon: 'cube-outline',
        title: 'Stock Inward',
        subtitle: 'Manage incoming inventory',
        summary: 'Modules: Seller lookup, raw material entry, weight/rate capture'
      },
      {
        icon: 'clipboard-outline',
        title: 'Order',
        subtitle: 'Create and track orders',
        summary: 'Modules: Buyer and product mapping, quantity planning, order lifecycle'
      },
      {
        icon: 'construct-outline',
        title: 'Production Shift',
        subtitle: 'Log and monitor production shifts',
        summary: 'Modules: Shift schedule, operators/supervisor, production and rejection'
      },
      {
        icon: 'document-text-outline',
        title: 'Invoice',
        subtitle: 'Generate and view invoices',
        summary: 'Modules: Invoice generation, totals, and dispatch-ready billing'
      },
      {
        icon: 'car-outline',
        title: 'Dispatch',
        subtitle: 'Schedule and track dispatch',
        summary: 'Modules: Dispatch planning, quantity movement, and tracking status'
      },
    ];

  }


  navigateTo(operation: string) {
    console.log(`Navigating to operation: ${operation}`);
    // Blur any focused element to prevent aria-hidden conflict
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
    if (operation === 'Production Shift') {
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
