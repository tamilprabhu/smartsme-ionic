import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MachineComponent } from 'src/app/forms/machine/machine.component';
import { Machine } from 'src/app/models/machine.model';
import { MachineService } from 'src/app/services/machine.service';

@Component({
    selector: 'app-machine-view',
    templateUrl: './machine-view.component.html',
    styleUrls: ['./machine-view.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, MachineComponent],
})
export class MachineViewComponent implements OnInit {
    machine: Machine | null = null;
    loading = true;
    machineId!: number;

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

    onBack(): void {
        this.router.navigate(['/machine']);
    }

    onEdit(): void {
        this.router.navigate(['/machine', this.machineId, 'edit']);
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
