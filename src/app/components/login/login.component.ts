import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HeaderComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private loginService: LoginService,
    private router: Router
  ) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  async login() {
    if (!this.username.trim() || !this.password.trim()) {
      await this.showToast('Please enter both username and password', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isLoading = true;

    this.loginService.login(this.username.trim(), this.password.trim()).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showToast(`Welcome ${response.user.name}!`, 'success');
        this.router.navigate(['/tabs']).catch(() => this.router.navigate(['/']));
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        const message = error.error?.error === 'Invalid password' 
          ? 'Invalid username or password' 
          : 'Login failed. Please try again. -- ' + error.toString();
        await this.showToast(message, 'danger');
      }
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
