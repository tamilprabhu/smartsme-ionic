import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';
import { StockComponent } from 'src/app/forms/stock/stock.component';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, StockComponent]
})
export class StockCreateComponent {
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly stockService: StockService
  ) {}

  onSubmit(formData: Stock): void {
    this.serverValidationErrors = {};

    this.stockService.createStock(formData).subscribe({
      next: () => {
        this.showToast('Stock created successfully', 'success');
        this.router.navigate(['/stock']);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to create stock', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stock']);
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
