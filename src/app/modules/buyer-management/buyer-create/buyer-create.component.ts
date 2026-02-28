import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BuyerComponent } from 'src/app/forms/buyer/buyer.component';
import { BuyerService, BuyerUpsertPayload } from 'src/app/services/buyer.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-buyer-create',
    templateUrl: './buyer-create.component.html',
    styleUrls: ['./buyer-create.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, BuyerComponent],
})
export class BuyerCreateComponent {
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly buyerService: BuyerService,
    ) {}

    onSubmit(payload: BuyerUpsertPayload): void {
        this.serverValidationErrors = {};

        this.buyerService.createBuyer(payload).subscribe({
            next: () => {
                this.showToast('Buyer created successfully', 'success');
                this.router.navigate(['/buyers']);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to create buyer', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/buyers']);
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
