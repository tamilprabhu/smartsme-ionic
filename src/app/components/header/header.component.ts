import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';

export type HeaderBackAction = 'back' | 'home' | 'dismiss' | 'custom';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() backAction: HeaderBackAction = 'back';
  @Input() showBackButton: boolean = true;
  @Input() rightIcon?: string; // Icon for right button (add, menu, etc.)
  @Input() rightIconColor?: string = 'primary';

  @Output() backClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();

  constructor(private navCtrl: NavController) {}

  onBackClick() {
    this.backClicked.emit();

    switch (this.backAction) {
      case 'back':
        this.navCtrl.back();
        break;
      case 'home':
        this.navCtrl.navigateRoot('/dashboard');
        break;
      case 'dismiss':
        // Handle modal dismiss if needed
        break;
      case 'custom':
        // Parent component handles via backClicked event
        break;
    }
  }

  onRightButtonClick() {
    this.rightButtonClicked.emit();
  }
}
