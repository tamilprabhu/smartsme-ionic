import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { ProductionShift } from '../models/production-shift.model';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';

export interface ProductionShiftResponse {
  items: ProductionShift[];
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
export class ProductionShiftService {
  private readonly API_URL = `${environment.apiBaseUrl}/production-shift`;

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

  getProductionShifts(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.SEQUENCE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<ProductionShiftResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (sortBy) {
      url += `&sortBy=${encodeURIComponent(sortBy)}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
    }
    return this.http.get<ProductionShiftResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getProductionShift(id: number): Observable<ProductionShift> {
    return this.http.get<ProductionShift>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createProductionShift(productionShift: Partial<ProductionShift>): Observable<ProductionShift> {
    return this.http.post<ProductionShift>(this.API_URL, productionShift, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProductionShift(id: number, productionShift: Partial<ProductionShift>): Observable<ProductionShift> {
    return this.http.put<ProductionShift>(`${this.API_URL}/${id}`, productionShift, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteProductionShift(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
