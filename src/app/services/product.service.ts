import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';
import { ItemsPerPage } from '../constants/pagination';
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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${API_BASE_URL}/product`;

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

  getProducts(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<ProductResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<ProductResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createProduct(product: Omit<Product, 'prodIdSeq' | 'createDate' | 'updateDate'>): Observable<Product> {
    const productData = {
      ...product,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    return this.http.post<Product>(this.API_URL, productData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProduct(id: number, product: Partial<Omit<Product, 'prodIdSeq' | 'createDate'>>): Observable<Product> {
    const updateData = {
      ...product,
      updateDate: new Date().toISOString()
    };
    return this.http.put<Product>(`${this.API_URL}/${id}`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteProduct(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
