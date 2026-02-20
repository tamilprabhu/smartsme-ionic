import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { Seller } from '../models/seller.model';

export interface SellerResponse {
  items: Seller[];
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
export class SellerService {
  private readonly API_URL = `${environment.apiBaseUrl}/seller`;

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

  getSellers(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<SellerResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<SellerResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getSeller(id: number): Observable<Seller> {
    return this.http.get<Seller>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createSeller(seller: Omit<Seller, 'sellerSequence' | 'createdAt' | 'updatedAt'>): Observable<Seller> {
    return this.http.post<Seller>(this.API_URL, seller, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateSeller(id: number, seller: Partial<Omit<Seller, 'sellerSequence' | 'createdAt'>>): Observable<Seller> {
    return this.http.put<Seller>(`${this.API_URL}/${id}`, seller, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteSeller(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
