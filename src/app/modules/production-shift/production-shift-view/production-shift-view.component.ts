import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductionShift } from 'src/app/models/production-shift.model';
import { ProductionShiftService } from 'src/app/services/production-shift.service';

@Component({
  selector: 'app-production-shift-view',
  templateUrl: './production-shift-view.component.html',
  styleUrls: ['./production-shift-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProductionShiftViewComponent implements OnInit {
  shift: ProductionShift | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private shiftService: ProductionShiftService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadShift(id);
  }

  loadShift(id: number) {
    this.shiftService.getProductionShift(id).subscribe({
      next: (shift) => {
        this.shift = shift;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load shift', 'danger');
        this.loading = false;
        this.router.navigate(['/tabs/production-shift']);
      }
    });
  }

  editShift() {
    this.router.navigate(['/tabs/production-shift', this.shift?.shiftIdSeq, 'edit']);
  }

  getShiftTypeLabel(shiftType: string): string {
    const types: Record<string, string> = { '1': 'Morning', '2': 'Evening', '3': 'Night' };
    return types[shiftType] || shiftType;
  }

  getEntryTypeLabel(entryType: string): string {
    const types: Record<string, string> = { '1': 'Shift', '2': 'Hours' };
    return types[entryType] || entryType;
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
