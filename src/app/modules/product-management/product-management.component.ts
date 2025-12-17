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
    this.productService.getProduct(product.prodIdSeq).subscribe({
      next: (productDetails) => {
        this.selectedProduct = productDetails;
        this.formMode = 'read';
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
      }
    });
  }

  openUpdateForm(product: Product) {
    this.productService.getProduct(product.prodIdSeq).subscribe({
      next: (productDetails) => {
        this.selectedProduct = productDetails;
        this.formMode = 'update';
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
    this.productService.deleteProduct(product.prodIdSeq).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.prodIdSeq !== product.prodIdSeq);
        console.log('Product deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }

  handleFormSubmit(formData: Product) {
    if (this.formMode === 'create') {
      this.productService.createProduct(formData).subscribe({
        next: (newProduct) => {
          this.products.unshift(newProduct);
          this.closeForm();
          console.log('Product created successfully');
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.prodIdSeq, formData).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.prodIdSeq === this.selectedProduct?.prodIdSeq);
          if (index > -1) {
            this.products[index] = updatedProduct;
          }
          this.closeForm();
          console.log('Product updated successfully');
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
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
