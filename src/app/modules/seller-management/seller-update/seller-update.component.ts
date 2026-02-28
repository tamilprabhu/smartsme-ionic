import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SellerComponent } from 'src/app/forms/seller/seller.component';
import { Seller } from 'src/app/models/seller.model';
import { SellerService, SellerUpsertPayload } from 'src/app/services/seller.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-seller-update',
    templateUrl: './seller-update.component.html',
    styleUrls: ['./seller-update.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, SellerComponent],
})
export class SellerUpdateComponent implements OnInit {
    seller: Seller | null = null;
    loading = true;
    sellerId!: number;
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly sellerService: SellerService,
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
            },
        });
    }

    onSubmit(payload: SellerUpsertPayload): void {
        this.serverValidationErrors = {};

        this.sellerService.updateSeller(this.sellerId, payload).subscribe({
            next: () => {
                this.showToast('Seller updated successfully', 'success');
                this.router.navigate(['/sellers', this.sellerId]);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to update seller', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/sellers', this.sellerId]);
    }

    private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            color,
            position: 'top',
        });
        await toast.present();
    }
}
