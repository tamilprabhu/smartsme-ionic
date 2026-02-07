import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../constants/pagination';
import { User } from '../models/user.model';

export interface UserResponse {
  items: User[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<UserResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<UserResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createUser(user: Omit<User, 'id' | 'createdDate' | 'updatedDate'>): Observable<User> {
    return this.http.post<User>(this.API_URL, user, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateUser(id: number, user: Partial<Omit<User, 'id' | 'createdDate'>>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteUser(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
