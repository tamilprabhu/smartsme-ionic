import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { OrderComponent } from 'src/app/forms/order/order.component';
import { Order } from 'src/app/models/order.model';
import { OrderService, OrderUpsertPayload } from 'src/app/services/order.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, OrderComponent]
})
export class OrderUpdateComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  orderId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly orderService: OrderService
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
      }
    });
  }

  onSubmit(payload: OrderUpsertPayload): void {
    this.serverValidationErrors = {};

    this.orderService.updateOrder(this.orderId, payload).subscribe({
      next: () => {
        this.showToast('Order updated successfully', 'success');
        this.router.navigate(['/orders', this.orderId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update order', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders', this.orderId]);
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
