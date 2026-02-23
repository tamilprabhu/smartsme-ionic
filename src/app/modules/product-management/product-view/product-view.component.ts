import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ProductComponent } from 'src/app/forms/product/product.component';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, ProductComponent]
})
export class ProductViewComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  productId!: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly productService: ProductService
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
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  onEdit(): void {
    this.router.navigate(['/products', this.productId, 'edit']);
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
