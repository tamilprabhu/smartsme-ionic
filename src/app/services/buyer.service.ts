import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../constants/pagination';
import { Buyer } from '../models/buyer.model';

export interface BuyerResponse {
  items: Buyer[];
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
export class BuyerService {
  private readonly API_URL = `${environment.apiBaseUrl}/buyer`;

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

  getBuyers(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<BuyerResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<BuyerResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getBuyer(id: number): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createBuyer(buyer: Omit<Buyer, 'buyerIdSeq' | 'createDate' | 'updateDate'>): Observable<Buyer> {
    return this.http.post<Buyer>(this.API_URL, buyer, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateBuyer(id: number, buyer: Partial<Omit<Buyer, 'buyerIdSeq' | 'createDate'>>): Observable<Buyer> {
    return this.http.put<Buyer>(`${this.API_URL}/${id}`, buyer, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteBuyer(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
