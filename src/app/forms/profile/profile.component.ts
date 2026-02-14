import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService, ProfileResponse } from 'src/app/services/login.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent implements OnInit {
  profile: ProfileResponse | null = null;
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  goBack() {
    this.router.navigate(['/tabs']).catch(() => this.router.navigate(['/']));
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']).catch(() => this.router.navigate(['/']));
  }

  async loadProfile() {
    this.isLoading = true;
    this.loginService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: async () => {
        this.isLoading = false;
        await this.showToast('Failed to load profile', 'danger');
      }
    });
  }

  getRolesLabel(): string {
    if (!this.profile || !this.profile.roles || this.profile.roles.length === 0) {
      return '-';
    }
    return this.profile.roles.map(role => role.name).join(', ');
  }

  getCompaniesLabel(): string {
    if (!this.profile || !this.profile.companies || this.profile.companies.length === 0) {
      return '-';
    }
    return this.profile.companies.map(company => company.companyName).join(', ');
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
