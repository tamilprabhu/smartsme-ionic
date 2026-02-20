import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Buyer } from '../../models/buyer.model';
import { BuyerService } from '../../services/buyer.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-buyer-management',
  templateUrl: './buyer-management.component.html',
  styleUrls: ['./buyer-management.component.scss'],
  standalone: false
})
export class BuyerManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  buyers: Buyer[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedBuyer: Buyer | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';
  serverValidationErrors: ServerValidationErrors = {};
  private backTarget = '/tabs/profile-masters';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private buyerService: BuyerService
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
    console.log('Buyer Management Component Initialized');
    this.backTarget = this.route.snapshot.queryParamMap.get('from') === 'dashboard'
      ? '/tabs/home'
      : '/tabs/profile-masters';
    this.loadBuyers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadBuyers(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.buyerService.getBuyers(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.buyers = response.items;
        } else {
          this.buyers = [...this.buyers, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading buyers:', error);
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
    this.buyers = [];
    this.loadBuyers();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedBuyer = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(buyer: Buyer) {
    this.buyerService.getBuyer(buyer.buyerSequence).subscribe({
      next: (buyerDetails) => {
        this.selectedBuyer = buyerDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading buyer details:', error);
      }
    });
  }

  openUpdateForm(buyer: Buyer) {
    this.buyerService.getBuyer(buyer.buyerSequence).subscribe({
      next: (buyerDetails) => {
        this.selectedBuyer = buyerDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading buyer details:', error);
      }
    });
  }

  async confirmDelete(buyer: Buyer) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete buyer "${buyer.buyerName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteBuyer(buyer);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteBuyer(buyer: Buyer) {
    this.buyerService.deleteBuyer(buyer.buyerSequence).subscribe({
      next: () => {
        this.buyers = this.buyers.filter(b => b.buyerSequence !== buyer.buyerSequence);
        console.log('Buyer deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting buyer:', error);
      }
    });
  }

  handleFormSubmit(formData: Buyer) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.buyerService.createBuyer(formData).subscribe({
        next: (newBuyer) => {
          this.buyers.unshift(newBuyer);
          this.closeForm();
          console.log('Buyer created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating buyer:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedBuyer) {
      this.buyerService.updateBuyer(this.selectedBuyer.buyerSequence, formData).subscribe({
        next: (updatedBuyer) => {
          const index = this.buyers.findIndex(b => b.buyerSequence === this.selectedBuyer?.buyerSequence);
          if (index > -1) {
            this.buyers[index] = updatedBuyer;
          }
          this.closeForm();
          console.log('Buyer updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating buyer:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedBuyer = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.router.navigate([this.backTarget]);
  }
}
