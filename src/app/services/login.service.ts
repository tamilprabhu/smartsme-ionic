import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface LoginResponse {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    mobile: string;
    address: string;
    roles: Array<{ id: number; name: string }>;
  };
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_URL = 'http://127.0.0.1:8080';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<any>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  private getStoredUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUser.asObservable();
  }

  login(identifier: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, {
      identifier,
      password
    }).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.loggedIn.next(true);
        this.currentUser.next(response.user);
        return response;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
