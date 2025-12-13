import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { Location } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FooterComponent, CommonModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  hasMore = true;
  loading = false;

  constructor(
    private location: Location,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(event?: any) {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    this.productService.getProducts(this.currentPage).subscribe({
      next: (response) => {
        this.products = [...this.products, ...response.items];
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
