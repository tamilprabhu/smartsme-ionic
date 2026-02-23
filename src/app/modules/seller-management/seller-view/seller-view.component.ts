import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SellerComponent } from 'src/app/forms/seller/seller.component';
import { Seller } from 'src/app/models/seller.model';
import { SellerService } from 'src/app/services/seller.service';

@Component({
  selector: 'app-seller-view',
  templateUrl: './seller-view.component.html',
  styleUrls: ['./seller-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, SellerComponent]
})
export class SellerViewComponent implements OnInit {
  seller: Seller | null = null;
  loading = true;
  sellerId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.sellerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSeller();
  }

  loadSeller(): void {
    this.sellerService.getSeller(this.sellerId).subscribe({
      next: (seller) => {
        this.seller = seller;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load seller', 'danger');
        this.router.navigate(['/sellers']);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/sellers']);
  }

  onEdit(): void {
    this.router.navigate(['/sellers', this.sellerId, 'edit']);
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
