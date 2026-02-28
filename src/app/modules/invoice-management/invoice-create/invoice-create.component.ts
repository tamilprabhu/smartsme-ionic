import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { InvoiceComponent } from 'src/app/forms/invoice/invoice.component';
import { InvoiceService, InvoiceUpsertPayload } from 'src/app/services/invoice.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-invoice-create',
    templateUrl: './invoice-create.component.html',
    styleUrls: ['./invoice-create.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, InvoiceComponent],
})
export class InvoiceCreateComponent {
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly invoiceService: InvoiceService,
    ) {}

    onSubmit(payload: InvoiceUpsertPayload): void {
        this.serverValidationErrors = {};

        this.invoiceService.createInvoice(payload).subscribe({
            next: () => {
                this.showToast('Invoice created successfully', 'success');
                this.router.navigate(['/invoice']);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to create invoice', 'danger');
                }
            },
        });
    }

    onCancel(): void {
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
