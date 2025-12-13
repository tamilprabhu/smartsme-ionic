import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { Company, CompanyListResponse } from '../models/company.model';
import { API_BASE_URL } from '../config/api.config';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = `${API_BASE_URL}/companies`;

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

  getCompanies(page: number = 1, limit: number = 10, search: string = ''): Observable<CompanyListResponse> {
    const params = `?page=${page}&limit=${limit}&search=${search}`;
    return this.http.get<CompanyListResponse>(`${this.API_URL}${params}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getCompany(companyIdSeq: number): Observable<Company> {
    return this.http.get<Company>(`${this.API_URL}/${companyIdSeq}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createCompany(company: Omit<Company, 'companyIdSeq' | 'createDate' | 'updateDate'>): Observable<any> {
    return this.http.post(this.API_URL, company, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateCompany(companyIdSeq: number, company: Partial<Company>): Observable<any> {
    return this.http.put(`${this.API_URL}/${companyIdSeq}`, company, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteCompany(companyIdSeq: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${companyIdSeq}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
