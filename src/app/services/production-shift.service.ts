import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';

export interface ProductionShift {
  shiftIdSeq?: number;
  orderId: string;
  companyId: string;
  shiftId: string;
  prodName: string;
  machineId: string;
  shiftStartDate: string;
  shiftEndDate: string;
  entryType: string;
  shiftType: string;
  operator1: number;
  operator2: number;
  operator3: number | null;
  supervisor: number;
  openingCount: number;
  closingCount: number;
  production: number;
  rejection: number;
  netProduction: number;
  incentive: string;
  less80Reason: string;
  createDate?: string;
  updateDate?: string;
}

export interface ProductionShiftListResponse {
  shifts: ProductionShift[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionShiftService {
  private readonly API_URL = `${API_BASE_URL}/production-shift`;

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

  getProductionShifts(page: number = 1, limit: number = 10, search: string = ''): Observable<ProductionShiftListResponse> {
    const params = `?page=${page}&limit=${limit}&search=${search}`;
    return this.http.get<ProductionShiftListResponse>(`${this.API_URL}${params}`, {
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

  createProductionShift(shift: Omit<ProductionShift, 'id' | 'createdAt' | 'updatedAt'>): Observable<ProductionShift> {
    return this.http.post<ProductionShift>(this.API_URL, shift, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProductionShift(id: number, shift: Partial<Omit<ProductionShift, 'id' | 'createdAt' | 'updatedAt'>>): Observable<ProductionShift> {
    return this.http.put<ProductionShift>(`${this.API_URL}/${id}`, shift, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteProductionShift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
