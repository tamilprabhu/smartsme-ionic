import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrls: ['./guest-home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HeaderComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GuestHomeComponent {
  isDarkMode = false;
  private readonly themeStorageKey = 'sme-theme';

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem(this.themeStorageKey) === 'dark';
  }

  setTheme(enabled: boolean): void {
    this.isDarkMode = enabled;
    localStorage.setItem(this.themeStorageKey, enabled ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-theme', enabled);
    document.body.classList.toggle('dark-theme', enabled);
  }
}
