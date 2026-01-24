import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Stock } from '../../models/stock.model';
import { StockService } from '../../services/stock.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss'],
  standalone: false
})
export class StockManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  stocks: Stock[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedStock: Stock | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private stockService: StockService,
    private operationsService: OperationsService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    console.log('Stock Management Component Initialized');
    this.loadStocks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadStocks(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.stockService.getStocks(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.stocks = response.items;
        } else {
          this.stocks = [...this.stocks, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading stocks:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.hasMore = true;
    this.stocks = [];
    this.loadStocks();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedStock = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(stock: Stock) {
    this.stockService.getStock(stock.stockIdSeq).subscribe({
      next: (stockDetails) => {
        this.selectedStock = stockDetails;
        this.formMode = 'read';
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading stock details:', error);
      }
    });
  }

  openUpdateForm(stock: Stock) {
    this.stockService.getStock(stock.stockIdSeq).subscribe({
      next: (stockDetails) => {
        this.selectedStock = stockDetails;
        this.formMode = 'update';
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading stock details:', error);
      }
    });
  }

  async confirmDelete(stock: Stock) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete stock "${stock.stockId}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteStock(stock);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteStock(stock: Stock) {
    this.stockService.deleteStock(stock.stockIdSeq).subscribe({
      next: () => {
        this.stocks = this.stocks.filter(s => s.stockIdSeq !== stock.stockIdSeq);
        console.log('Stock deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting stock:', error);
      }
    });
  }

  handleFormSubmit(formData: Stock) {
    if (this.formMode === 'create') {
      this.stockService.createStock(formData).subscribe({
        next: (newStock) => {
          this.stocks.unshift(newStock);
          this.closeForm();
          console.log('Stock created successfully');
        },
        error: (error) => {
          console.error('Error creating stock:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedStock) {
      this.stockService.updateStock(this.selectedStock.stockIdSeq, formData).subscribe({
        next: (updatedStock) => {
          const index = this.stocks.findIndex(s => s.stockIdSeq === this.selectedStock?.stockIdSeq);
          if (index > -1) {
            this.stocks[index] = updatedStock;
          }
          this.closeForm();
          console.log('Stock updated successfully');
        },
        error: (error) => {
          console.error('Error updating stock:', error);
        }
      });
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedStock = null;
    this.formMode = null;
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.operationsService.navigateToOperations();
  }
}
