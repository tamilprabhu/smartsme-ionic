import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StockComponent } from 'src/app/forms/stock/stock.component';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-stock-update',
  templateUrl: './stock-update.component.html',
  styleUrls: ['./stock-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, StockComponent]
})
export class StockUpdateComponent implements OnInit {
  stock: Stock | null = null;
  loading = true;
  stockId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly stockService: StockService
  ) {}

  ngOnInit(): void {
    this.stockId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStock();
  }

  loadStock(): void {
    this.stockService.getStock(this.stockId).subscribe({
      next: (stock) => {
        this.stock = stock;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load stock', 'danger');
        this.router.navigate(['/stock']);
      }
    });
  }

  onSubmit(formData: Stock): void {
    this.serverValidationErrors = {};

    this.stockService.updateStock(this.stockId, formData).subscribe({
      next: () => {
        this.showToast('Stock updated successfully', 'success');
        this.router.navigate(['/stock', this.stockId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update stock', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stock', this.stockId]);
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
