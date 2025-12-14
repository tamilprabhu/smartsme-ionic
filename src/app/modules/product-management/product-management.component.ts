import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: false
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedProduct: Product | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private productService: ProductService
  ) {
    // Setup reactive search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    console.log('Product Management Component Initialized');
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadProducts(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.productService.getProducts(this.currentPage).subscribe({
      next: (response) => {
        this.products = [...this.products, ...response.items];
        this.applySearch(); // Apply search to new items
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    // Update display immediately for UI consistency
    this.searchQuery = value;
    // Send to Subject for debounced filtering
    this.searchSubject.next(value);
  }

  performSearch(query: string) {
    // This gets called after debounce with the actual search value
    const normalizedQuery = query.toLowerCase().trim();
    this.applySearch(normalizedQuery);
  }

  applySearch(query?: string) {
    const searchTerm = query !== undefined ? query : this.searchQuery.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.prodName.toLowerCase().includes(searchTerm) ||
        product.prodId.toString().includes(searchTerm) ||
        product.rawMaterial.toLowerCase().includes(searchTerm)
      );
    }
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.searchSubject.next('');
    this.applySearch('');
  }

  openCreateForm() {
    this.selectedProduct = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(product: Product) {
    this.selectedProduct = product;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(product: Product) {
    this.selectedProduct = product;
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete product "${product.prodName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter(p => p.prodId !== product.prodId);
    this.applySearch(); // Reapply search after deletion
  }

  handleFormSubmit(formData: Product) {
    if (this.formMode === 'create') {
      this.products.push(formData);
    } else if (this.formMode === 'update' && this.selectedProduct) {
      const index = this.products.findIndex(p => p.prodId === this.selectedProduct?.prodId);
      if (index > -1) {
        this.products[index] = formData;
      }
    }
    this.applySearch(); // Reapply search after create/update
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedProduct = null;
    this.formMode = null;
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.navCtrl.back();
  }
}
