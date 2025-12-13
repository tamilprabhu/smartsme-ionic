import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Seller } from 'src/app/models/seller.model';

@Component({
  selector: 'app-seller-management',
  templateUrl: './seller-management.component.html',
  styleUrls: ['./seller-management.component.scss'],
  standalone: false
})
export class SellerManagementComponent {
  sellers: Seller[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedSeller: Seller | null = null;
  showForm = false;

  constructor(private alertController: AlertController, private navCtrl: NavController) {
    this.loadSellers();
  }

  ngOnInit() {
    console.log('Seller Management Component Initialized');
  }

  // Dummy API function to load sample sellers
  loadSellers() {
    this.sellers = [
      { sellerId: 'S001', sellerName: 'Alpha Traders', address: '123 Alpha Street', phone: '+91 9876543210', email: 'contact@alphatraders.com', gstin: 'GSTIN001' },
      { sellerId: 'S002', sellerName: 'Beta Supplies', address: '456 Beta Avenue', phone: '+91 9123456780', email: 'info@betasupplies.in', gstin: 'GSTIN002' }
    ];
  }

  openCreateForm() {
    this.selectedSeller = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(seller: Seller) {
    this.selectedSeller = seller;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(seller: Seller) {
    this.selectedSeller = seller;
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(seller: Seller) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete seller "${seller.sellerName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteSeller(seller);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteSeller(seller: Seller) {
    this.sellers = this.sellers.filter(s => s.sellerId !== seller.sellerId);
  }

  handleFormSubmit(formData: Seller) {
    if (this.formMode === 'create') {
      this.sellers.push(formData);
    } else if (this.formMode === 'update' && this.selectedSeller) {
      const index = this.sellers.findIndex(s => s.sellerId === this.selectedSeller?.sellerId);
      if (index > -1) {
        this.sellers[index] = formData;
      }
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedSeller = null;
    this.formMode = null;
  }

  goBack() {
    this.navCtrl.back();
  }
}
