import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { API_BASE_URL } from '../config/api.config';

export interface Machine {
  machineIdSeq: number;
  machineId: string;
  companyId: string;
  machineName: string;
  machineType: string;
  capacity: string;
  model: string;
  activeFlag: string;
  createDate: string;
  updateDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private readonly API_URL = `${API_BASE_URL}/machines`;

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

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.API_URL, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getMachine(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createMachine(machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>): Observable<Machine> {
    return this.http.post<Machine>(this.API_URL, machine, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateMachine(id: number, machine: Partial<Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Machine> {
    return this.http.put<Machine>(`${this.API_URL}/${id}`, machine, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
