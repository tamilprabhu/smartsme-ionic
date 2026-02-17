import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';

export interface RoleItem {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: number | boolean;
  isDeleted?: number | boolean;
  createdBy?: number;
  updatedBy?: number;
}

export interface RoleResponse {
  items: RoleItem[];
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
export class RoleService {
  private readonly API_URL = `${environment.apiBaseUrl}/role`;

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

  getRoles(
    page: number = 1,
    limit: number = ItemsPerPage.HUNDRED,
    search?: string,
    sortBy: SortBy = SortBy.SEQUENCE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<RoleResponse> {
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

    return this.http.get<RoleResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
