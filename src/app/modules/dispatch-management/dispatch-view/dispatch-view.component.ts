import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DispatchComponent } from 'src/app/forms/dispatch/dispatch.component';
import { Dispatch } from 'src/app/models/dispatch.model';
import { DispatchService } from 'src/app/services/dispatch.service';

@Component({
    selector: 'app-dispatch-view',
    templateUrl: './dispatch-view.component.html',
    styleUrls: ['./dispatch-view.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, DispatchComponent],
})
export class DispatchViewComponent implements OnInit {
    dispatch: Dispatch | null = null;
    loading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly dispatchService: DispatchService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.dispatchService.getDispatch(id).subscribe({
            next: (dispatch) => {
                this.dispatch = dispatch;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load dispatch', 'danger');
                this.router.navigate(['/dispatch']);
            },
        });
    }

    onBack(): void {
        this.router.navigate(['/dispatch']);
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
