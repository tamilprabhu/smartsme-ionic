import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { ProductionShiftService } from 'src/app/services/production-shift.service';
import { ProductionShiftFormComponent } from '../components/production-shift-form/production-shift-form.component';

@Component({
  selector: 'app-production-shift-update',
  templateUrl: './production-shift-update.component.html',
  styleUrls: ['./production-shift-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ProductionShiftFormComponent]
})
export class ProductionShiftUpdateComponent implements OnInit {
  shift: ProductionShift | null = null;
  loading = true;
  shiftId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private shiftService: ProductionShiftService
  ) {}

  ngOnInit() {
    this.shiftId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadShift();
  }

  loadShift() {
    this.shiftService.getProductionShift(this.shiftId).subscribe({
      next: (shift) => {
        this.shift = shift;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load shift', 'danger');
        this.router.navigate(['/tabs/production-shift']);
      }
    });
  }

  onSubmit(formData: Partial<ProductionShift>) {
    this.shiftService.updateProductionShift(this.shiftId, formData).subscribe({
      next: () => {
        this.showToast('Shift updated successfully', 'success');
        this.router.navigate(['/tabs/production-shift', this.shiftId]);
      },
      error: () => this.showToast('Failed to update shift', 'danger')
    });
  }

  onCancel() {
    this.router.navigate(['/tabs/production-shift', this.shiftId]);
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
