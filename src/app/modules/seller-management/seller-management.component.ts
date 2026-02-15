import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Seller } from '../../models/seller.model';
import { SellerService } from '../../services/seller.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-seller-management',
  templateUrl: './seller-management.component.html',
  styleUrls: ['./seller-management.component.scss'],
  standalone: false
})
export class SellerManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  sellers: Seller[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedSeller: Seller | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';
  serverValidationErrors: ServerValidationErrors = {};

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private router: Router,
    private sellerService: SellerService
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
    console.log('Seller Management Component Initialized');
    this.loadSellers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadSellers(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.sellerService.getSellers(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.sellers = response.items;
        } else {
          this.sellers = [...this.sellers, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
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
    this.sellers = [];
    this.loadSellers();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedSeller = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(seller: Seller) {
    this.sellerService.getSeller(seller.sellerIdSeq).subscribe({
      next: (sellerDetails) => {
        this.selectedSeller = sellerDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading seller details:', error);
      }
    });
  }

  openUpdateForm(seller: Seller) {
    this.sellerService.getSeller(seller.sellerIdSeq).subscribe({
      next: (sellerDetails) => {
        this.selectedSeller = sellerDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading seller details:', error);
      }
    });
  }

  async confirmDelete(seller: Seller) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete seller "${seller.sellerName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteSeller(seller);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteSeller(seller: Seller) {
    this.sellerService.deleteSeller(seller.sellerIdSeq).subscribe({
      next: () => {
        this.sellers = this.sellers.filter(s => s.sellerIdSeq !== seller.sellerIdSeq);
        console.log('Seller deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting seller:', error);
      }
    });
  }

  handleFormSubmit(formData: Seller) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.sellerService.createSeller(formData).subscribe({
        next: (newSeller) => {
          this.sellers.unshift(newSeller);
          this.closeForm();
          console.log('Seller created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating seller:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedSeller) {
      this.sellerService.updateSeller(this.selectedSeller.sellerIdSeq, formData).subscribe({
        next: (updatedSeller) => {
          const index = this.sellers.findIndex(s => s.sellerIdSeq === this.selectedSeller?.sellerIdSeq);
          if (index > -1) {
            this.sellers[index] = updatedSeller;
          }
          this.closeForm();
          console.log('Seller updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating seller:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedSeller = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.router.navigate(['/tabs/profile-masters']);
  }
}
