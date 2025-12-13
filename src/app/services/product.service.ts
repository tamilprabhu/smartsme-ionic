import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';
import { ItemsPerPage } from '../constants/pagination';

export interface Product {
  prodIdSeq: number;
  prodId: string;
  companyId: string;
  prodName: string;
  rawMaterial: string;
  weight: string;
  wastage: number;
  norms: string;
  totalWeight: string;
  cavity: number;
  shotRate: string;
  perItemRate: string;
  incentiveLimit: number;
  createDate: string;
  updateDate: string;
}

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
  private readonly API_URL = `${API_BASE_URL}/products`;

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

  getProducts(page: number = 1, limit: number = ItemsPerPage.TEN): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}?page=${page}&limit=${limit}`, {
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

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
