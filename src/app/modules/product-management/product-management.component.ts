import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';

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

  constructor(private alertController: AlertController, private navCtrl: NavController) {
    this.loadProducts();
  }

  ngOnInit() {
    console.log('Product Management Component Initialized');
  }

  // Dummy API to load sample products
  loadProducts() {
    this.products = [
      {
        productId: 'P001',
        productName: 'Widget A',
        rawMaterial: 'Steel',
        weight: 12.5,
        wastage: 2,
        norms: 0.5,
        totalWeight: 12.75,
        cavity: 4,
        shotRate: 3.5,
        rate: 120.0,
        incentiveLimit: 1000,
        productionShotQty: 500,
        perHourProdQty: 150.0
      },
      {
        productId: 'P002',
        productName: 'Gadget B',
        rawMaterial: 'Plastic',
        weight: 8.0,
        wastage: 1,
        norms: 0.3,
        totalWeight: 8.08,
        cavity: 2,
        shotRate: 5.0,
        rate: 75.5,
        incentiveLimit: 800,
        productionShotQty: 400,
        perHourProdQty: 120.0
      }
    ];
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
    this.products = this.products.filter(p => p.productId !== product.productId);
  }

  handleFormSubmit(formData: Product) {
    if (this.formMode === 'create') {
      this.products.push(formData);
    } else if (this.formMode === 'update' && this.selectedProduct) {
      const index = this.products.findIndex(p => p.productId === this.selectedProduct?.productId);
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
