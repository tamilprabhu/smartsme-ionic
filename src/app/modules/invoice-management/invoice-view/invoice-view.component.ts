import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { InvoiceComponent } from 'src/app/forms/invoice/invoice.component';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
    selector: 'app-invoice-view',
    templateUrl: './invoice-view.component.html',
    styleUrls: ['./invoice-view.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, InvoiceComponent],
})
export class InvoiceViewComponent implements OnInit {
    invoice: Invoice | null = null;
    loading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly invoiceService: InvoiceService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.invoiceService.getInvoice(id).subscribe({
            next: (invoice) => {
                this.invoice = invoice;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load invoice', 'danger');
                this.router.navigate(['/invoice']);
            },
        });
    }

    onBack(): void {
        this.router.navigate(['/invoice']);
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
