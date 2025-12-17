import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';
import { ItemsPerPage } from '../constants/pagination';
import { Dispatch } from '../models/dispatch.model';

export interface DispatchResponse {
  items: Dispatch[];
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
export class DispatchService {
  private readonly API_URL = `${API_BASE_URL}/dispatch`;

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

  getDispatches(page: number = 1, limit: number = ItemsPerPage.TEN, search?: string): Observable<DispatchResponse> {
    let url = `${this.API_URL}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<DispatchResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getDispatch(id: number): Observable<Dispatch> {
    return this.http.get<Dispatch>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createDispatch(dispatch: Omit<Dispatch, 'dispatchIdSeq' | 'createDate' | 'updateDate'>): Observable<Dispatch> {
    return this.http.post<Dispatch>(this.API_URL, dispatch, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateDispatch(id: number, dispatch: Partial<Omit<Dispatch, 'dispatchIdSeq' | 'createDate'>>): Observable<Dispatch> {
    return this.http.put<Dispatch>(`${this.API_URL}/${id}`, dispatch, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteDispatch(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
