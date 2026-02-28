import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { ItemsPerPage } from '../enums/items-per-page.enum';
import { SortBy } from '../enums/sort-by.enum';
import { SortOrder } from '../enums/sort-order.enum';
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

export interface InvoiceUpsertPayload {
    invoiceDate: string;
    buyerId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    cgstRate: number;
    cgstAmount: number;
    sgstRate: number;
    sgstAmount: number;
    totalAmount: number;
    sacCode: string;
    buyrGstin: string;
}

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    private readonly API_URL = `${environment.apiBaseUrl}/invoice`;

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

    getInvoices(
        page: number = 1,
        limit: number = ItemsPerPage.TEN,
        search?: string,
        sortBy: SortBy = SortBy.CREATE_DATE,
        sortOrder: SortOrder = SortOrder.DESC,
    ): Observable<InvoiceResponse> {
        let params = new HttpParams()
            .set('page', String(page))
            .set('itemsPerPage', String(limit))
            .set('sortBy', sortBy)
            .set('sortOrder', sortOrder);

        if (search?.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http
            .get<InvoiceResponse>(this.API_URL, {
                headers: this.getHeaders(),
                params,
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    getInvoice(id: number): Observable<Invoice> {
        return this.http
            .get<Invoice>(`${this.API_URL}/${id}`, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    createInvoice(invoice: InvoiceUpsertPayload): Observable<Invoice> {
        return this.http
            .post<Invoice>(this.API_URL, invoice, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    updateInvoice(id: number, invoice: Partial<InvoiceUpsertPayload>): Observable<Invoice> {
        return this.http
            .put<Invoice>(`${this.API_URL}/${id}`, invoice, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }

    deleteInvoice(id: number): Observable<{ message: string }> {
        return this.http
            .delete<{ message: string }>(`${this.API_URL}/${id}`, {
                headers: this.getHeaders(),
            })
            .pipe(catchError((error) => throwError(() => error)));
    }
}
