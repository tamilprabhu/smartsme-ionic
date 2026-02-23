import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CompanyComponent } from 'src/app/forms/company/company.component';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, CompanyComponent]
})
export class CompanyUpdateComponent implements OnInit {
  company: Company | null = null;
  loading = true;
  companyId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCompany();
  }

  loadCompany(): void {
    this.companyService.getCompany(this.companyId).subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load company', 'danger');
        this.router.navigate(['/company']);
      }
    });
  }

  onSubmit(formData: Company): void {
    this.serverValidationErrors = {};

    this.companyService.updateCompany(this.companyId, formData).subscribe({
      next: () => {
        this.showToast('Company updated successfully', 'success');
        this.router.navigate(['/company', this.companyId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update company', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/company', this.companyId]);
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
