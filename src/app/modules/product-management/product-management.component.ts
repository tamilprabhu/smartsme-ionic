import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: false
})
export class ProductManagementComponent {
  products: Product[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedProduct: Product | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;

  constructor(
    private alertController: AlertController, 
    private navCtrl: NavController,
    private productService: ProductService
  ) {}

  ngOnInit() {
    console.log('Product Management Component Initialized');
    this.loadProducts();
  }

  loadProducts(event?: any) {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    this.productService.getProducts(this.currentPage).subscribe({
      next: (response) => {
        this.products = [...this.products, ...response.items];
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
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedProduct = null;
    this.formMode = null;
  }

  goBack() {
    this.navCtrl.back();
  }
}
