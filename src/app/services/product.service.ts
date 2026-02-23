import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { Product } from '../models/product.model';

export interface ProductResponse {
  items: Product[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface ProductUpsertPayload {
  productName: string;
  rawMaterial: string;
  weight: number;
  wastage: number;
  norms: number;
  totalWeight: number;
  cavity: number;
  shotRate: number;
  perItemRate: number;
  incentiveLimit: number;
  salesType: string;
  salesCode: string;
  salesPercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiBaseUrl}/product`;

  constructor(
    private readonly http: HttpClient,
    private readonly loginService: LoginService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getProducts(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('itemsPerPage', String(limit));

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ProductResponse>(this.API_URL, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  createProduct(product: ProductUpsertPayload): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateProduct(id: number, product: Partial<ProductUpsertPayload>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
