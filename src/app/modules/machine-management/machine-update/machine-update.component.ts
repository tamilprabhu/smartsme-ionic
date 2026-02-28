import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MachineComponent } from 'src/app/forms/machine/machine.component';
import { Machine } from 'src/app/models/machine.model';
import { MachineService, MachineUpsertPayload } from 'src/app/services/machine.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-machine-update',
    templateUrl: './machine-update.component.html',
    styleUrls: ['./machine-update.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, MachineComponent],
})
export class MachineUpdateComponent implements OnInit {
    machine: Machine | null = null;
    loading = true;
    machineId!: number;
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly machineService: MachineService,
    ) {}

    ngOnInit(): void {
        this.machineId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadMachine();
    }

    loadMachine(): void {
        this.machineService.getMachine(this.machineId).subscribe({
            next: (machine) => {
                this.machine = machine;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load machine', 'danger');
                this.router.navigate(['/machine']);
            },
        });
    }

    onSubmit(payload: MachineUpsertPayload): void {
        this.serverValidationErrors = {};

        this.machineService.updateMachine(this.machineId, payload).subscribe({
            next: () => {
                this.showToast('Machine updated successfully', 'success');
                this.router.navigate(['/machine', this.machineId]);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to update machine', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/machine', this.machineId]);
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
