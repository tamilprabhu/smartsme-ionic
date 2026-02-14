import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

interface DecodedToken {
  iss: string;
  aud: string;
  sub: string;
  jti: string;
  username: string;
  roles: string[];
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

interface ChangePasswordResponse {
  message: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  roles: Array<{ id: number; name: string }>;
  companies: Array<{ companyId: string; companyName: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_URL = `${environment.apiBaseUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<any>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): DecodedToken {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  private getStoredUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUser.asObservable();
  }

  login(identifier: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
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

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ accessToken: string }>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        return response;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.API_URL}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
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

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      return this.decodeToken(token);
    } catch {
      return null;
    }
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
}
