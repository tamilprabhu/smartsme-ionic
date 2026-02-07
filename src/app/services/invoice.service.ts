import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../constants/pagination';
import { Invoice } from '../models/invoice.model';

export interface InvoiceResponse {
  items: Invoice[];
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
export class InvoiceService {
  private readonly API_URL = `${environment.apiBaseUrl}/invoice`;

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

  getInvoices(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<InvoiceResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<InvoiceResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createInvoice(invoice: Omit<Invoice, 'invoiceSeq' | 'createDate' | 'updateDate'>): Observable<Invoice> {
    return this.http.post<Invoice>(this.API_URL, invoice, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateInvoice(id: number, invoice: Partial<Omit<Invoice, 'invoiceSeq' | 'createDate'>>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.API_URL}/${id}`, invoice, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteInvoice(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
