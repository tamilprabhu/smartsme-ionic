import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BuyerComponent } from 'src/app/forms/buyer/buyer.component';
import { Buyer } from 'src/app/models/buyer.model';
import { BuyerService } from 'src/app/services/buyer.service';

@Component({
  selector: 'app-buyer-view',
  templateUrl: './buyer-view.component.html',
  styleUrls: ['./buyer-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, BuyerComponent]
})
export class BuyerViewComponent implements OnInit {
  buyer: Buyer | null = null;
  loading = true;
  buyerId!: number;

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

  onBack(): void {
    this.router.navigate(['/buyers']);
  }

  onEdit(): void {
    this.router.navigate(['/buyers', this.buyerId, 'edit']);
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
