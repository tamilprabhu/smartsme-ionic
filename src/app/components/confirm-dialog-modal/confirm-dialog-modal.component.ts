import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-dialog-modal',
  templateUrl: './confirm-dialog-modal.component.html',
  styleUrls: ['./confirm-dialog-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ConfirmDialogModalComponent {
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() confirmColor: 'danger' | 'primary' | 'secondary' = 'danger';

  constructor(private readonly modalController: ModalController) {}

  cancel(): void {
    this.modalController.dismiss(false, 'cancel');
  }

  confirm(): void {
    this.modalController.dismiss(true, 'confirm');
  }
}
