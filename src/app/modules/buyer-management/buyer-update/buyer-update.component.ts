import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BuyerComponent } from 'src/app/forms/buyer/buyer.component';
import { Buyer } from 'src/app/models/buyer.model';
import { BuyerService, BuyerUpsertPayload } from 'src/app/services/buyer.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-buyer-update',
  templateUrl: './buyer-update.component.html',
  styleUrls: ['./buyer-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, BuyerComponent]
})
export class BuyerUpdateComponent implements OnInit {
  buyer: Buyer | null = null;
  loading = true;
  buyerId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly buyerService: BuyerService
  ) {}

  ngOnInit(): void {
    this.buyerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBuyer();
  }

  loadBuyer(): void {
    this.buyerService.getBuyer(this.buyerId).subscribe({
      next: (buyer) => {
        this.buyer = buyer;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load buyer', 'danger');
        this.router.navigate(['/buyers']);
      }
    });
  }

  onSubmit(payload: BuyerUpsertPayload): void {
    this.serverValidationErrors = {};

    this.buyerService.updateBuyer(this.buyerId, payload).subscribe({
      next: () => {
        this.showToast('Buyer updated successfully', 'success');
        this.router.navigate(['/buyers', this.buyerId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update buyer', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/buyers', this.buyerId]);
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
