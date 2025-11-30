import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Seller } from 'src/app/models/seller.model';

@Component({
  selector: 'app-seller-management',
  templateUrl: './seller-management.component.html',
  styleUrls: ['./seller-management.component.scss'],
  standalone: false
})
export class SellerManagementComponent {
  sellers: Seller[] = [];
  selectedSeller: Seller | null = null;
  formMode: 'create' | 'read' | 'update' = 'create';
  showForm = false;

  constructor(private alertController: AlertController) {}

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
    this.selectedSeller = { ...seller };
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(seller: Seller) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete seller "${seller.sellerName}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deleteSeller(seller)
        }
      ]
    });
    await alert.present();
  }

  deleteSeller(seller: Seller) {
    this.sellers = this.sellers.filter(s => s.sellerId !== seller.sellerId);
  }

  handleFormSubmit(data: Seller) {
    if (this.formMode === 'create') {
      this.sellers.push(data);
    } else if (this.formMode === 'update' && this.selectedSeller) {
      const idx = this.sellers.findIndex(s => s.sellerId === this.selectedSeller?.sellerId);
      if (idx > -1) {
        this.sellers[idx] = data;
      }
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedSeller = null;
  }

  goBack() {
    history.back(); // simple browser back
  }

}
