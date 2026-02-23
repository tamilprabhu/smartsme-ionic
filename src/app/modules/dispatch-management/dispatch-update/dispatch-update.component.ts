import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DispatchComponent } from 'src/app/forms/dispatch/dispatch.component';
import { Dispatch } from 'src/app/models/dispatch.model';
import { DispatchService, DispatchUpsertPayload } from 'src/app/services/dispatch.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-dispatch-update',
  templateUrl: './dispatch-update.component.html',
  styleUrls: ['./dispatch-update.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, DispatchComponent]
})
export class DispatchUpdateComponent implements OnInit {
  dispatch: Dispatch | null = null;
  loading = true;
  dispatchId!: number;
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly dispatchService: DispatchService
  ) {}

  ngOnInit(): void {
    this.dispatchId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDispatch();
  }

  loadDispatch(): void {
    this.dispatchService.getDispatch(this.dispatchId).subscribe({
      next: (dispatch) => {
        this.dispatch = dispatch;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load dispatch', 'danger');
        this.router.navigate(['/dispatch']);
      }
    });
  }

  onSubmit(payload: DispatchUpsertPayload): void {
    this.serverValidationErrors = {};

    this.dispatchService.updateDispatch(this.dispatchId, payload).subscribe({
      next: () => {
        this.showToast('Dispatch updated successfully', 'success');
        this.router.navigate(['/dispatch', this.dispatchId]);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to update dispatch', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dispatch', this.dispatchId]);
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
