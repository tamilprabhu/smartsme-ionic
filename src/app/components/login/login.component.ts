import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private loginService: LoginService
  ) {}

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
        this.loginSuccess.emit();
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