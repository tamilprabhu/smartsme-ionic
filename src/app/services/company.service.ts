import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { Company } from '../models/company.model';

export interface CompanyResponse {
  items: Company[];
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
export class CompanyService {
  private readonly API_URL = `${environment.apiBaseUrl}/company`;

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

  getCompanies(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.CREATE_DATE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<CompanyResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('itemsPerPage', String(limit))
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<CompanyResponse>(this.API_URL, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createCompany(company: Omit<Company, 'companySequence' | 'createdAt' | 'updatedAt'>): Observable<Company> {
    return this.http.post<Company>(this.API_URL, company, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateCompany(id: number, company: Partial<Omit<Company, 'companySequence' | 'createdAt'>>): Observable<Company> {
    return this.http.put<Company>(`${this.API_URL}/${id}`, company, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteCompany(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
