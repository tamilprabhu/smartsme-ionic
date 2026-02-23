import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MachineComponent } from 'src/app/forms/machine/machine.component';
import { MachineService, MachineUpsertPayload } from 'src/app/services/machine.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, MachineComponent]
})
export class MachineCreateComponent {
  serverValidationErrors: ServerValidationErrors = {};

  constructor(
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly machineService: MachineService
  ) {}

  onSubmit(payload: MachineUpsertPayload): void {
    this.serverValidationErrors = {};

    this.machineService.createMachine(payload).subscribe({
      next: () => {
        this.showToast('Machine created successfully', 'success');
        this.router.navigate(['/machine']);
      },
      error: (error) => {
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          this.showToast('Failed to create machine', 'danger');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/machine']);
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
