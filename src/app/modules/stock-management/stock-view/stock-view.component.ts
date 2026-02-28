import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StockComponent } from 'src/app/forms/stock/stock.component';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
    selector: 'app-stock-view',
    templateUrl: './stock-view.component.html',
    styleUrls: ['./stock-view.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, StockComponent],
})
export class StockViewComponent implements OnInit {
    stock: Stock | null = null;
    loading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly stockService: StockService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.stockService.getStock(id).subscribe({
            next: (stock) => {
                this.stock = stock;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load stock', 'danger');
                this.router.navigate(['/stock']);
            },
        });
    }

    onBack(): void {
        this.router.navigate(['/stock']);
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
