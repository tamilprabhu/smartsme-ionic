import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { OrderComponent } from 'src/app/forms/order/order.component';
import { OrderService, OrderUpsertPayload } from 'src/app/services/order.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-order-create',
    templateUrl: './order-create.component.html',
    styleUrls: ['./order-create.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, OrderComponent],
})
export class OrderCreateComponent {
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly orderService: OrderService,
    ) {}

    onSubmit(payload: OrderUpsertPayload): void {
        this.serverValidationErrors = {};

        this.orderService.createOrder(payload).subscribe({
            next: () => {
                this.showToast('Order created successfully', 'success');
                this.router.navigate(['/orders']);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to create order', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/orders']);
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
