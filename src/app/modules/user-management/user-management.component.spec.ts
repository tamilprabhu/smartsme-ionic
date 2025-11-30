import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  users: User[] = [
    {
      username: 'admin',
      password: 'password123',
      userType: 'admin',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@smartsme.co.in',
      mobile: '+91 9876543210',
      address: '123 Main Street, Chennai, Tamil Nadu',
      gstin: ''
    }
  ];

  formMode: 'create' | 'read' | 'update' = 'create';
  selectedUser: User | null = null;
  showForm = false;

  constructor(private alertController: AlertController) {}

  goBack() {
    // navigate back using router or your own logic
    history.back();
  }

  openCreateForm() {
    this.selectedUser = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(user: User) {
    this.selectedUser = user;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(user: User) {
    this.selectedUser = { ...user };
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(user: User) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete user "${user.username}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deleteUser(user)
        }
      ]
    });
    await alert.present();
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.username !== user.username);
  }

  handleFormSubmit(formData: User) {
    if (this.formMode === 'create') {
      this.users.push(formData);
    } else if (this.formMode === 'update' && this.selectedUser) {
      const idx = this.users.findIndex(u => u.username === this.selectedUser?.username);
      if (idx > -1) this.users[idx] = formData;
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedUser = null;
    this.formMode = 'create';
  }
}
