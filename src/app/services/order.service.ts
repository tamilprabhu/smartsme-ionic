import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { Order } from '../models/order.model';

export interface OrderResponse {
  items: Order[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface OrderUpsertPayload {
  orderName: string;
  productId: string;
  buyerId: string;
  orderStatus: string;
  orderDate: string;
  targetDate: string;
  orderQuantity: number;
  price: number;
  discount: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiBaseUrl}/order`;

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

  getOrders(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.CREATE_DATE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<OrderResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('itemsPerPage', String(limit))
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<OrderResponse>(this.API_URL, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  createOrder(order: OrderUpsertPayload): Observable<Order> {
    return this.http.post<Order>(this.API_URL, order, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateOrder(id: number, order: Partial<OrderUpsertPayload>): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/${id}`, order, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteOrder(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
