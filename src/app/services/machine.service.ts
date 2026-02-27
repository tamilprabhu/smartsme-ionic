import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { Machine } from '../models/machine.model';

export interface MachineResponse {
  items: Machine[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface MachineUpsertPayload {
  machineName: string;
  machineType: string;
  capacity: string;
  model: string;
  activeFlag: 'Y' | 'N';
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private readonly API_URL = `${environment.apiBaseUrl}/machine`;

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

  getMachines(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.CREATE_DATE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<MachineResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('itemsPerPage', String(limit))
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MachineResponse>(this.API_URL, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getMachine(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  createMachine(machine: MachineUpsertPayload): Observable<Machine> {
    return this.http.post<Machine>(this.API_URL, machine, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateMachine(id: number, machine: Partial<MachineUpsertPayload>): Observable<Machine> {
    return this.http.put<Machine>(`${this.API_URL}/${id}`, machine, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteMachine(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
