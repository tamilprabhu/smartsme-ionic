import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SellerComponent } from 'src/app/forms/seller/seller.component';
import { SellerService, SellerUpsertPayload } from 'src/app/services/seller.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-seller-create',
  templateUrl: './seller-create.component.html',
  styleUrls: ['./seller-create.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, SellerComponent]
})
export class SellerCreateComponent {
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly sellerService: SellerService
  ) {}

  onSubmit(payload: SellerUpsertPayload): void {
    this.serverValidationErrors = {};

    this.sellerService.createSeller(payload).subscribe({
      next: () => {
        this.showToast('Seller created successfully', 'success');
        this.router.navigate(['/sellers']);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to create seller', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/sellers']);
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
