import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ProductComponent } from 'src/app/forms/product/product.component';
import { ProductService, ProductUpsertPayload } from 'src/app/services/product.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, ProductComponent],
})
export class ProductCreateComponent {
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly productService: ProductService,
    ) {}

    onSubmit(payload: ProductUpsertPayload): void {
        this.serverValidationErrors = {};

        this.productService.createProduct(payload).subscribe({
            next: () => {
                this.showToast('Product created successfully', 'success');
                this.router.navigate(['/products']);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to create product', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/products']);
    }

    private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            color,
            position: 'top',
        });
        await toast.present();
    }
}
