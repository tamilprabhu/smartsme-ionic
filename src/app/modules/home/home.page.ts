import { Component, OnInit } from '@angular/core';
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

  private readonly adminRoles = ['ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'];
  private readonly roleMap: Record<string, string[]> = {
    company: ['COMPANY', 'COMPANY_MANAGEMENT'],
    products: ['PRODUCT', 'PRODUCT_MANAGEMENT'],
    machines: ['MACHINE', 'MACHINE_MANAGEMENT'],
    users: ['USER', 'USER_MANAGEMENT'],
    sellers: ['SELLER', 'SELLER_MANAGEMENT'],
    buyers: ['BUYER', 'BUYER_MANAGEMENT'],
    stock: ['STOCK', 'STOCK_MANAGEMENT', 'INVENTORY', 'STORE']
  };

  constructor(
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

  private isAdmin(): boolean {
    return true; //this.hasAnyRole(this.adminRoles);
  }

  private canView(key: keyof HomePage['roleMap']): boolean {
    return this.isAdmin() || this.hasAnyRole(this.roleMap[key]);
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
      ].filter(item => this.canView(item.key as keyof HomePage['roleMap']));

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
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return [];
      const user = JSON.parse(raw);
      if (Array.isArray(user?.roles)) {
        return user.roles.map((role: any) => role?.name ?? role).filter(Boolean);
      }
    } catch {
      return [];
    }
    return [];
  }

  private hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
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

}
