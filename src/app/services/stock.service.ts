import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { Stock } from '../models/stock.model';

export interface StockResponse {
  items: Stock[];
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
export class StockService {
  private readonly API_URL = `${environment.apiBaseUrl}/stock`;

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

  getStocks(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<StockResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<StockResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getStock(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createStock(stock: Omit<Stock, 'stockSequence' | 'createdAt' | 'updatedAt'>): Observable<Stock> {
    return this.http.post<Stock>(this.API_URL, stock, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateStock(id: number, stock: Partial<Omit<Stock, 'stockSequence' | 'createdAt'>>): Observable<Stock> {
    return this.http.put<Stock>(`${this.API_URL}/${id}`, stock, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteStock(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
