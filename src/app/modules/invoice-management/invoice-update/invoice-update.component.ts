import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { InvoiceComponent } from 'src/app/forms/invoice/invoice.component';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService, InvoiceUpsertPayload } from 'src/app/services/invoice.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, InvoiceComponent]
})
export class InvoiceUpdateComponent implements OnInit {
  invoice: Invoice | null = null;
  loading = true;
  invoiceId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadInvoice();
  }

  loadInvoice(): void {
    this.invoiceService.getInvoice(this.invoiceId).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load invoice', 'danger');
        this.router.navigate(['/invoice']);
      }
    });
  }

  onSubmit(payload: InvoiceUpsertPayload): void {
    this.serverValidationErrors = {};

    this.invoiceService.updateInvoice(this.invoiceId, payload).subscribe({
      next: () => {
        this.showToast('Invoice updated successfully', 'success');
        this.router.navigate(['/invoice', this.invoiceId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update invoice', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/invoice', this.invoiceId]);
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
