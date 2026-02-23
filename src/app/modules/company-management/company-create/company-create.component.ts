import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyComponent } from 'src/app/forms/company/company.component';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, CompanyComponent]
})
export class CompanyCreateComponent {
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly companyService: CompanyService
  ) {}

  onSubmit(formData: Company): void {
    this.serverValidationErrors = {};

    this.companyService.createCompany(formData).subscribe({
      next: () => {
        this.showToast('Company created successfully', 'success');
        this.router.navigate(['/company']);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to create company', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/company']);
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
