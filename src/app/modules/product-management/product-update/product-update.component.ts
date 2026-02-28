import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ProductComponent } from 'src/app/forms/product/product.component';
import { Product } from 'src/app/models/product.model';
import { ProductService, ProductUpsertPayload } from 'src/app/services/product.service';
import {
    ServerValidationErrors,
    extractServerValidationErrors,
} from 'src/app/utils/server-validation.util';

@Component({
    selector: 'app-product-update',
    templateUrl: './product-update.component.html',
    styleUrls: ['./product-update.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, ProductComponent],
})
export class ProductUpdateComponent implements OnInit {
    product: Product | null = null;
    loading = true;
    productId!: number;
    serverValidationErrors: ServerValidationErrors = {};

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController,
        private readonly productService: ProductService,
    ) {}

    ngOnInit(): void {
        this.productId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadProduct();
    }

    loadProduct(): void {
        this.productService.getProduct(this.productId).subscribe({
            next: (product) => {
                this.product = product;
                this.loading = false;
            },
            error: () => {
                this.showToast('Failed to load product', 'danger');
                this.router.navigate(['/products']);
            },
        });
    }

    onSubmit(payload: ProductUpsertPayload): void {
        this.serverValidationErrors = {};

        this.productService.updateProduct(this.productId, payload).subscribe({
            next: () => {
                this.showToast('Product updated successfully', 'success');
                this.router.navigate(['/products', this.productId]);
            },
            error: (error) => {
                this.serverValidationErrors = extractServerValidationErrors(error);
                if (Object.keys(this.serverValidationErrors).length === 0) {
                    this.showToast('Failed to update product', 'danger');
                }
            },
        });
    }

    onCancel(): void {
        this.router.navigate(['/products', this.productId]);
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
