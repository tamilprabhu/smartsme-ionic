import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  standalone: false
})
export class ProductManagementComponent {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  formMode: 'create' | 'read' | 'update' = 'create';
  showForm = false;

  constructor(private alertController: AlertController) {}

  goBack() {
    history.back();
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
    this.selectedProduct = { ...product };
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete product "${product.productName}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteProduct(product) }
      ]
    });
    await alert.present();
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter(p => p.productId !== product.productId);
  }

  handleFormSubmit(data: Product) {
    if (this.formMode === 'create') {
      this.products.push(data);
    } else if (this.formMode === 'update' && this.selectedProduct) {
      const index = this.products.findIndex(p => p.productId === this.selectedProduct?.productId);
      if (index > -1) this.products[index] = data;
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedProduct = null;
  }
}
