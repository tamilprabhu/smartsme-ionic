import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
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

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private toastCtrl: ToastController,
    private loginService: LoginService
  ) {}

  ngAfterViewInit() {
    
  }

  async login() {
    if (this.username.trim() && this.password.trim()) {
      // Here, add your authentication logic (API call etc.)
      // For demo, assume login success if both fields are filled
      localStorage.setItem('isLoggedIn', 'true');
    
      const isLoginSuccess = this.loginService.login(this.username, this.password);
      
      if(isLoginSuccess) {
        // Navigate to your app's home or menu page after login
        this.loginSuccess.emit();
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Invalid username or password',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    } else {
      // Show toast notification for invalid input
      const toast = await this.toastCtrl.create({
        message: 'Please enter both username and password',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}