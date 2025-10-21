import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // BehaviorSubject to store login state and allow subscription
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {}

  // Check if user is logged in based on stored token or flag
  private hasToken(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Observable to watch login status
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Perform login; here mocked with username/password validation
  login(username: string, password: string): boolean {
    // Replace this with real authentication call (API)
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      this.loggedIn.next(true);
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  // Logout method clears storage and updates status
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.loggedIn.next(false);
  }
}
