import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class OperationsService {

    constructor(private router: Router) { }

    navigateToOperations() {
        // Blur any focused element to prevent aria-hidden conflict
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        this.router.navigate(['/tabs/operations']);
    }
}