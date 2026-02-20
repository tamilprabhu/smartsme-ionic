import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { StockService } from 'src/app/services/stock.service';
import { ProductService } from 'src/app/services/product.service';
import { MachineService } from 'src/app/services/machine.service';
import { UserService } from 'src/app/services/user.service';
import { SellerService } from 'src/app/services/seller.service';
import { BuyerService } from 'src/app/services/buyer.service';
import { CompanyService } from 'src/app/services/company.service';
import { ItemsPerPage } from 'src/app/enums/items-per-page.enum';
import {
  AppModuleKey,
  canAccessModule
} from 'src/app/utils/module-access.util';
import { getRolesFromStoredUser } from 'src/app/utils/role-access.util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  companyName = '';
  canViewStock = false;
  private userRoles: string[] = [];

  stockSummary = {
    total: 0,
    latestDate: '',
    latestMaterial: ''
  };

  summaryCards: Array<{ key: string; label: string; count: number }> = [];

  private readonly moduleMap: Record<string, AppModuleKey> = {
    company: 'COMPANY',
    products: 'PRODUCTS',
    machines: 'MACHINE_PROCESS',
    users: 'EMPLOYEES',
    sellers: 'SELLERS',
    buyers: 'BUYERS',
    stock: 'STOCK_INWARD'
  };

  private readonly dashboardRouteMap: Record<string, string> = {
    products: '/products',
    machines: '/machine-process',
    users: '/employee/list',
    sellers: '/sellers',
    buyers: '/buyers',
    company: '/company'
  };

  constructor(
    private router: Router,
    private loginService: LoginService,
    private stockService: StockService,
    private productService: ProductService,
    private machineService: MachineService,
    private userService: UserService,
    private sellerService: SellerService,
    private buyerService: BuyerService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.userRoles = this.getRoles();
    this.loadProfile();
    this.loadDashboard();
  }

  private canView(key: keyof HomePage['moduleMap']): boolean {
    return canAccessModule(this.userRoles, this.moduleMap[key]);
  }

  private loadProfile() {
    this.loginService.getProfile().subscribe({
      next: (profile) => {
        this.companyName = profile?.companies?.[0]?.companyName || '';
        const profileRoles = profile?.roles?.map(role => role.name) || [];
        if (profileRoles.length) {
          this.userRoles = profileRoles;
          this.loadDashboard();
        }
      },
      error: () => {
        this.companyName = '';
      }
    });
  }

  private loadDashboard() {
    this.canViewStock = this.canView('stock');

    const products$ = this.canView('products')
      ? this.safe(this.productService.getProducts(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const machines$ = this.canView('machines')
      ? this.safe(this.machineService.getMachines(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const users$ = this.canView('users')
      ? this.safe(this.userService.getUsers(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const sellers$ = this.canView('sellers')
      ? this.safe(this.sellerService.getSellers(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const buyers$ = this.canView('buyers')
      ? this.safe(this.buyerService.getBuyers(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const companies$ = this.canView('company')
      ? this.safe(this.companyService.getCompanies(1, ItemsPerPage.ONE).pipe(map(r => r.paging.totalItems)))
      : from([null]);
    const stock$ = this.canViewStock
      ? this.safe(this.stockService.getStocks(1, ItemsPerPage.ONE))
      : from([null]);

    forkJoin({
      products: products$,
      machines: machines$,
      users: users$,
      sellers: sellers$,
      buyers: buyers$,
      companies: companies$,
      stock: stock$
    }).subscribe((res) => {
      this.summaryCards = [
        { key: 'products', label: 'Products', count: res.products ?? 0 },
        { key: 'machines', label: 'Machines', count: res.machines ?? 0 },
        { key: 'users', label: 'Users', count: res.users ?? 0 },
        { key: 'sellers', label: 'Sellers', count: res.sellers ?? 0 },
        { key: 'buyers', label: 'Buyers', count: res.buyers ?? 0 },
        { key: 'company', label: 'Company', count: res.companies ?? 0 }
      ].filter(item => this.canView(item.key as keyof HomePage['moduleMap']));

      if (res.stock) {
        this.stockSummary.total = res.stock.paging.totalItems || 0;
        const latest = res.stock.items?.[0];
        this.stockSummary.latestDate = latest?.stockDate || '';
        this.stockSummary.latestMaterial = latest?.rawMaterial || '';
      }
    });
  }

  private getRoles(): string[] {
    const decodedRoles = this.loginService.getUserRoles();
    if (decodedRoles.length) {
      return decodedRoles;
    }
    return getRolesFromStoredUser(localStorage.getItem('currentUser'));
  }

  private safe<T>(source$: Observable<T>): Observable<T | null> {
    return new Observable<T | null>((subscriber) => {
      const sub = source$.subscribe({
        next: (value) => subscriber.next(value),
        error: () => {
          subscriber.next(null);
          subscriber.complete();
        },
        complete: () => subscriber.complete()
      });
      return () => sub.unsubscribe();
    });
  }

  openStockInward(): void {
    this.router.navigate(['/tabs/stock-management'], {
      queryParams: { from: 'dashboard' }
    });
  }

  openOverviewModule(key: string): void {
    const route = this.dashboardRouteMap[key];
    if (!route) {
      return;
    }

    this.router.navigate([route], {
      queryParams: { from: 'dashboard' }
    });
  }
}
