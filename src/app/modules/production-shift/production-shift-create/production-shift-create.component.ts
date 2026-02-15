import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { ProductionShiftService } from 'src/app/services/production-shift.service';
import { ProductionShiftFormComponent } from '../components/production-shift-form/production-shift-form.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-production-shift-create',
  templateUrl: './production-shift-create.component.html',
  styleUrls: ['./production-shift-create.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ProductionShiftFormComponent, HeaderComponent]
})
export class ProductionShiftCreateComponent {
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private router: Router,
    private toastController: ToastController,
    private shiftService: ProductionShiftService
  ) {}

  onSubmit(formData: Partial<ProductionShift>) {
    this.serverValidationErrors = {};

    this.shiftService.createProductionShift(formData).subscribe({
      next: () => {
        this.showToast('Shift created successfully', 'success');
        this.router.navigate(['/tabs/production-shift']);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to create shift', 'danger');
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/tabs/production-shift']);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
