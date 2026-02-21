import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfirmDialogModalComponent } from './confirm-dialog-modal.component';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: 'danger' | 'primary' | 'secondary';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private readonly modalController: ModalController) {}

  async confirm(options: ConfirmDialogOptions): Promise<boolean> {
    const modal = await this.modalController.create({
      component: ConfirmDialogModalComponent,
      cssClass: 'app-confirm-dialog-modal',
      componentProps: {
        title: options.title ?? 'Confirm Action',
        message: options.message,
        cancelText: options.cancelText ?? 'Cancel',
        confirmText: options.confirmText ?? 'Delete',
        confirmColor: options.confirmColor ?? 'danger'
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data === true;
  }
}
