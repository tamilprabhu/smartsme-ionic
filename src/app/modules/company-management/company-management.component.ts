import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss'],
  standalone: false
})
export class CompanyManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  companies: Company[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedCompany: Company | null = null;
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
    private companyService: CompanyService
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
    console.log('Company Management Component Initialized');
    this.loadCompanies();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadCompanies(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.companyService.getCompanies(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.companies = response.items;
        } else {
          this.companies = [...this.companies, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading companies:', error);
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
    this.companies = [];
    this.loadCompanies();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedCompany = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(company: Company) {
    this.companyService.getCompany(company.companyIdSeq!).subscribe({
      next: (companyDetails) => {
        this.selectedCompany = companyDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading company details:', error);
      }
    });
  }

  openUpdateForm(company: Company) {
    this.companyService.getCompany(company.companyIdSeq!).subscribe({
      next: (companyDetails) => {
        this.selectedCompany = companyDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading company details:', error);
      }
    });
  }

  async confirmDelete(company: Company) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete company "${company.companyName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteCompany(company);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteCompany(company: Company) {
    this.companyService.deleteCompany(company.companyIdSeq!).subscribe({
      next: () => {
        this.companies = this.companies.filter(c => c.companyIdSeq !== company.companyIdSeq);
        console.log('Company deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting company:', error);
      }
    });
  }

  handleFormSubmit(formData: Company) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.companyService.createCompany(formData).subscribe({
        next: (newCompany) => {
          this.companies.unshift(newCompany);
          this.closeForm();
          console.log('Company created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating company:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedCompany) {
      this.companyService.updateCompany(this.selectedCompany.companyIdSeq!, formData).subscribe({
        next: (updatedCompany) => {
          const index = this.companies.findIndex(c => c.companyIdSeq === this.selectedCompany?.companyIdSeq);
          if (index > -1) {
            this.companies[index] = updatedCompany;
          }
          this.closeForm();
          console.log('Company updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating company:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedCompany = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.router.navigate(['/tabs/profile-masters']);
  }
}
