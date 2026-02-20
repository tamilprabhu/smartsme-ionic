import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService, ProductUpsertPayload } from '../../services/product.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: false
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  products: Product[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedProduct: Product | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';
  serverValidationErrors: ServerValidationErrors = {};
  private backTarget = '/tabs/profile-masters';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
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
    this.backTarget = this.route.snapshot.queryParamMap.get('from') === 'dashboard'
      ? '/tabs/home'
      : '/tabs/profile-masters';
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
    this.productService.getProducts(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.products = response.items;
        } else {
          this.products = [...this.products, ...response.items];
        }
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
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.hasMore = true;
    this.products = [];
    this.loadProducts();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedProduct = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(product: Product) {
    this.productService.getProduct(product.prodSequence).subscribe({
      next: (productDetails) => {
        this.selectedProduct = productDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
      }
    });
  }

  openUpdateForm(product: Product) {
    this.productService.getProduct(product.prodSequence).subscribe({
      next: (productDetails) => {
        this.selectedProduct = productDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
      }
    });
  }

  async confirmDelete(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete product "${product.productName}"?`,
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
    this.productService.deleteProduct(product.prodSequence).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.prodSequence !== product.prodSequence);
        console.log('Product deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }

  handleFormSubmit(formData: ProductUpsertPayload) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.productService.createProduct(formData).subscribe({
        next: (newProduct) => {
          this.products.unshift(newProduct);
          this.closeForm();
          console.log('Product created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating product:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.prodSequence, formData).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.prodSequence === this.selectedProduct?.prodSequence);
          if (index > -1) {
            this.products[index] = updatedProduct;
          }
          this.closeForm();
          console.log('Product updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating product:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedProduct = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.router.navigate([this.backTarget]);
  }
}
