import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Buyer } from 'src/app/models/buyer.model';

@Component({
  selector: 'app-buyer-management',
  templateUrl: './buyer-management.component.html',
  styleUrls: ['./buyer-management.component.scss'],
  standalone: false
})
export class BuyerManagementComponent {
  buyers: Buyer[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedBuyer: Buyer | null = null;
  showForm = false;

  constructor(private alertController: AlertController, private navCtrl: NavController) {
    this.loadBuyers();
  }

  ngOnInit() {
    console.log('Buyer Management Component Initialized');
  }

  // Dummy API to load sample buyers
  loadBuyers() {
    this.buyers = [
      { buyerId: 'B001', buyerName: 'Gamma Corp', address: '789 Gamma Road', phone: '+91 9988776655', email: 'sales@gammacorp.com', gstin: 'GSTIN100' },
      { buyerId: 'B002', buyerName: 'Delta Enterprises', address: '321 Delta Lane', phone: '+91 8877665544', email: 'contact@deltaent.in', gstin: 'GSTIN200' }
    ];
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
    this.selectedBuyer = buyer;
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(buyer: Buyer) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete buyer "${buyer.buyerName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteBuyer(buyer);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteBuyer(buyer: Buyer) {
    this.buyers = this.buyers.filter(b => b.buyerId !== buyer.buyerId);
  }

  handleFormSubmit(formData: Buyer) {
    if (this.formMode === 'create') {
      this.buyers.push(formData);
    } else if (this.formMode === 'update' && this.selectedBuyer) {
      const index = this.buyers.findIndex(b => b.buyerId === this.selectedBuyer?.buyerId);
      if (index > -1) {
        this.buyers[index] = formData;
      }
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedBuyer = null;
    this.formMode = null;
  }

  goBack() {
    this.navCtrl.back();
  }
}
