import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';

export interface StateItem {
  id: number;
  stateName: string;
  stateCode: string;
}

export interface DistrictItem {
  id: number;
  districtName: string;
}

export interface PincodeItem {
  id: number;
  postOfficeName: string;
  pincode: string;
  stateName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private readonly API_URL = `${environment.apiBaseUrl}/reference`;

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

  getStates(): Observable<StateItem[]> {
    return this.http.get<StateItem[]>(`${this.API_URL}/states`, { headers: this.getHeaders() }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getDistricts(stateId: number): Observable<DistrictItem[]> {
    return this.http.get<DistrictItem[]>(`${this.API_URL}/districts/${stateId}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getPincodes(pincode: string): Observable<PincodeItem[]> {
    return this.http.get<PincodeItem[]>(`${this.API_URL}/pincodes?pincode=${encodeURIComponent(pincode)}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
