import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-guest-signup',
  templateUrl: './guest-signup.component.html',
  styleUrls: ['./guest-signup.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GuestSignupComponent {}
