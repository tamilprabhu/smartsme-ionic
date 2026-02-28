import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';
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

export interface DispatchUpsertPayload {
    orderId: string;
    productId: string;
    dispatchDate: string;
    quantity: number;
    noOfPacks: number;
    totalWeight: number;
    normalWeight: number;
    normsWeight: number;
}

@Injectable({
    providedIn: 'root',
})
export class DispatchService {
    private readonly API_URL = `${environment.apiBaseUrl}/dispatch`;

    constructor(
        private http: HttpClient,
        private loginService: LoginService,
    ) {}

    private getHeaders(): HttpHeaders {
        const token = this.loginService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }

    getDispatches(
        page: number = 1,
        limit: number = ItemsPerPage.TEN,
        search?: string,
        sortBy: SortBy = SortBy.CREATE_DATE,
        sortOrder: SortOrder = SortOrder.DESC,
    ): Observable<DispatchResponse> {
        let params = new HttpParams()
            .set('page', String(page))
            .set('itemsPerPage', String(limit))
            .set('sortBy', sortBy)
            .set('sortOrder', sortOrder);

        if (search?.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http
            .get<DispatchResponse>(this.API_URL, {
                headers: this.getHeaders(),
                params,
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    getDispatch(id: number): Observable<Dispatch> {
        return this.http
            .get<Dispatch>(`${this.API_URL}/${id}`, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    createDispatch(dispatch: DispatchUpsertPayload): Observable<Dispatch> {
        return this.http
            .post<Dispatch>(this.API_URL, dispatch, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    updateDispatch(id: number, dispatch: Partial<DispatchUpsertPayload>): Observable<Dispatch> {
        return this.http
            .put<Dispatch>(`${this.API_URL}/${id}`, dispatch, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    deleteDispatch(id: number): Observable<{ message: string }> {
        return this.http
            .delete<{ message: string }>(`${this.API_URL}/${id}`, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }
}
