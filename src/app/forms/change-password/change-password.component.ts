import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HeaderComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;

  constructor(
    private loginService: LoginService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      await this.showToast('New password and confirmation do not match', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.loginService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: async (response) => {
        this.isSubmitting = false;
        await this.showToast(response.message || 'Password changed successfully', 'success');
        this.resetForm(form);
      },
      error: async (error) => {
        this.isSubmitting = false;
        const message = error?.error?.error || 'Failed to change password';
        await this.showToast(message, 'danger');
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']).catch(() => this.router.navigate(['/tabs']));
  }

  private resetForm(form: NgForm) {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    form.resetForm();
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
