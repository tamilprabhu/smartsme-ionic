import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';
import { ItemsPerPage } from '../constants/pagination';
import { OrderQuantity } from '../models/order-quantity.model';

export interface OrderQuantityResponse {
  items: OrderQuantity[];
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
export class OrderQuantityService {
  private readonly API_URL = `${API_BASE_URL}/order-quantity`;

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

  getOrderQuantities(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<OrderQuantityResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<OrderQuantityResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getOrderQuantity(id: string): Observable<OrderQuantity> {
    return this.http.get<OrderQuantity>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createOrderQuantity(orderQuantity: Omit<OrderQuantity, 'createDate' | 'updateDate'>): Observable<OrderQuantity> {
    return this.http.post<OrderQuantity>(this.API_URL, orderQuantity, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateOrderQuantity(id: string, orderQuantity: Partial<Omit<OrderQuantity, 'orderId' | 'createDate'>>): Observable<OrderQuantity> {
    return this.http.put<OrderQuantity>(`${this.API_URL}/${id}`, orderQuantity, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteOrderQuantity(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
