import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../constants/pagination';
import { ProductionHourly } from '../models/production-hourly.model';

export interface ProductionHourlyResponse {
  items: ProductionHourly[];
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
export class ProductionHourlyService {
  private readonly API_URL = `${environment.apiBaseUrl}/production-hourly`;

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

  getProductionHourlies(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<ProductionHourlyResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<ProductionHourlyResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getProductionHourly(id: string): Observable<ProductionHourly> {
    return this.http.get<ProductionHourly>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createProductionHourly(productionHourly: ProductionHourly): Observable<ProductionHourly> {
    return this.http.post<ProductionHourly>(this.API_URL, productionHourly, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProductionHourly(id: string, productionHourly: Partial<Omit<ProductionHourly, 'orderId'>>): Observable<ProductionHourly> {
    return this.http.put<ProductionHourly>(`${this.API_URL}/${id}`, productionHourly, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteProductionHourly(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
