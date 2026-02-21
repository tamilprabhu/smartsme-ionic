import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HeaderComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaqComponent {
  constructor(private readonly router: Router) {}

  goBack(): void {
    this.router.navigate(['/tabs/home']);
  }
}
