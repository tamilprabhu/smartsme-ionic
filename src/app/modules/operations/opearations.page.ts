import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { AppModuleKey, canAccessModule } from 'src/app/utils/module-access.util';

interface OperationItem {
  icon: string;
  title: string;
  subtitle: string;
  summary: string;
  route: string;
  moduleKey: AppModuleKey;
}

@Component({
  selector: 'app-operations',
  templateUrl: 'operations.page.html',
  styleUrls: ['operations.page.scss'],
  standalone: false,
})
export class OperationsPage {
  operations: OperationItem[] = [];
  private readonly temporarilyHiddenModules: AppModuleKey[] = ['STOCK_INWARD', 'ORDER', 'INVOICE'];

  private readonly allOperations: OperationItem[] = [
    {
      icon: 'cube-outline',
      title: 'Stock Inward',
      subtitle: 'Manage incoming inventory',
      summary: 'Modules: Seller lookup, raw material entry, weight/rate capture',
      route: '/tabs/stock-management',
      moduleKey: 'STOCK_INWARD'
    },
    {
      icon: 'clipboard-outline',
      title: 'Order',
      subtitle: 'Create and track orders',
      summary: 'Modules: Buyer and product mapping, quantity planning, order lifecycle',
      route: '/tabs/order-management',
      moduleKey: 'ORDER'
    },
    {
      icon: 'construct-outline',
      title: 'Production Shift',
      subtitle: 'Log and monitor production shifts',
      summary: 'Modules: Shift schedule, operators/supervisor, production and rejection',
      route: '/tabs/production-shift',
      moduleKey: 'PRODUCTION_SHIFT'
    },
    {
      icon: 'document-text-outline',
      title: 'Invoice',
      subtitle: 'Generate and view invoices',
      summary: 'Modules: Invoice generation, totals, and dispatch-ready billing',
      route: '/tabs/invoice-management',
      moduleKey: 'INVOICE'
    },
    {
      icon: 'car-outline',
      title: 'Dispatch',
      subtitle: 'Schedule and track dispatch',
      summary: 'Modules: Dispatch planning, quantity movement, and tracking status',
      route: '/tabs/dispatch-management',
      moduleKey: 'DISPATCH'
    }
  ];

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const userRoles = this.loginService.getUserRoles();
    this.operations = this.allOperations.filter(
      (item) => canAccessModule(userRoles, item.moduleKey) && !this.temporarilyHiddenModules.includes(item.moduleKey)
    );
  }


  navigateTo(operation: OperationItem) {
    // Blur any focused element to prevent aria-hidden conflict
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
    this.router.navigateByUrl(operation.route);
  }

}
