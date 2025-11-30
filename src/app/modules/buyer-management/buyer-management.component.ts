import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Buyer } from 'src/app/models/buyer.model';

@Component({
  selector: 'app-buyer-management',
  templateUrl: './buyer-management.component.html',
  styleUrls: ['./buyer-management.component.scss'],
  standalone: false
})
export class BuyerManagementComponent {
  buyers: Buyer[] = [];
  selectedBuyer: Buyer | null = null;
  formMode: 'create' | 'read' | 'update' = 'create';
  showForm = false;

  constructor(private alertController: AlertController) {}

  goBack() {
    history.back();
  }

  openCreateForm() {
    this.selectedBuyer = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(buyer: Buyer) {
    this.selectedBuyer = buyer;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(buyer: Buyer) {
    this.selectedBuyer = { ...buyer };
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(buyer: Buyer) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete buyer "${buyer.buyerName}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteBuyer(buyer) }
      ]
    });
    await alert.present();
  }

  deleteBuyer(buyer: Buyer) {
    this.buyers = this.buyers.filter(b => b.buyerId !== buyer.buyerId);
  }

  handleFormSubmit(data: Buyer) {
    if (this.formMode === 'create') {
      this.buyers.push(data);
    } else if (this.formMode === 'update' && this.selectedBuyer) {
      const index = this.buyers.findIndex(b => b.buyerId === this.selectedBuyer?.buyerId);
      if (index > -1) this.buyers[index] = data;
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedBuyer = null;
  }
}
