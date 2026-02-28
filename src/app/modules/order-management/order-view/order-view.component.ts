import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { OrderComponent } from 'src/app/forms/order/order.component';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
    selector: 'app-order-view',
    templateUrl: './order-view.component.html',
    styleUrls: ['./order-view.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, OrderComponent],
})
export class OrderViewComponent implements OnInit {
    order: Order | null = null;
    loading = true;
    orderId!: number;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly orderService: OrderService,
    ) {}

    ngOnInit(): void {
        this.orderId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadOrder();
    }

    loadOrder(): void {
        this.orderService.getOrder(this.orderId).subscribe({
            next: (order) => {
                this.order = order;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load order', 'danger');
                this.router.navigate(['/orders']);
            },
        });
    }

    onBack(): void {
        this.router.navigate(['/orders']);
    }

    onEdit(): void {
        this.router.navigate(['/orders', this.orderId, 'edit']);
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
