import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { Employee } from '../models/employee.model';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';

export interface EmployeeResponse {
  items: Employee[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface EmployeeDropdownItem {
  value: number;
  label: string;
  userId: number;
  employeeId: number;
}

export interface EmployeeDropdownResponse {
  items: EmployeeDropdownItem[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface EmployeeWithUserRole {
  roleId: number;
  Role?: {
    id: number;
    name: string;
  };
}

export interface EmployeeWithUserUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: number | boolean;
  isDeleted?: number | boolean;
  createdBy?: number | string;
  updatedBy?: number | string;
  UserRoles?: EmployeeWithUserRole[];
}

export interface EmployeeWithUserItem {
  employeeSequence: number;
  userId: number;
  companyId: string;
  salary: number;
  activeFlag: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: number | boolean;
  isDeleted?: number | boolean;
  createdBy?: number | string;
  updatedBy?: number | string;
  roleId?: number;
  User?: EmployeeWithUserUser;
  user?: EmployeeWithUserUser;
}

export interface EmployeeWithUserResponse {
  items: EmployeeWithUserItem[];
  paging: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface CreateEmployeeWithUserPayload {
  user: {
    username: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    mobile: string;
    address: string;
    password?: string;
  };
  employee: {
    salary: number;
    activeFlag: string;
  };
  roleUser: {
    roleId: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = `${environment.apiBaseUrl}/employee`;

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

  getEmployees(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.SEQUENCE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<EmployeeResponse> {
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
    return this.http.get<EmployeeResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createEmployee(employee: Omit<Employee, 'employeeSequence' | 'createdAt' | 'updatedAt'>): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, employee, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateEmployee(id: number, employee: Partial<Omit<Employee, 'employeeSequence' | 'createdAt'>>): Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, employee, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteEmployee(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getEmployeesByRole(
    roleNames: string[],
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.SEQUENCE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<EmployeeDropdownResponse> {
    const roleParam = roleNames.map(role => role.trim()).filter(Boolean).join(',');
    let url = `${this.API_URL}/role/${encodeURIComponent(roleParam)}?page=${page}&itemsPerPage=${limit}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (sortBy) {
      url += `&sortBy=${encodeURIComponent(sortBy)}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
    }
    return this.http.get<EmployeeDropdownResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getEmployeeRegistrations(
    page: number = 1,
    limit: number = ItemsPerPage.TEN,
    search?: string,
    sortBy: SortBy = SortBy.SEQUENCE,
    sortOrder: SortOrder = SortOrder.DESC
  ): Observable<EmployeeWithUserResponse> {
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
    return this.http.get<EmployeeWithUserResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getEmployeeRegistration(employeeSequence: number): Observable<EmployeeWithUserItem> {
    return this.http.get<EmployeeWithUserItem>(`${this.API_URL}/${employeeSequence}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createEmployeeRegistration(payload: CreateEmployeeWithUserPayload): Observable<EmployeeWithUserItem> {
    return this.http.post<EmployeeWithUserItem>(`${this.API_URL}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateEmployeeRegistration(employeeSequence: number, payload: CreateEmployeeWithUserPayload): Observable<EmployeeWithUserItem> {
    return this.http.patch<EmployeeWithUserItem>(`${this.API_URL}/${employeeSequence}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteEmployeeRegistration(employeeSequence: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${employeeSequence}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
