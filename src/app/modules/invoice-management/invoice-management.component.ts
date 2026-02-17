import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss'],
  standalone: false
})
export class InvoiceManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  invoices: Invoice[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedInvoice: Invoice | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private invoiceService: InvoiceService,
    private operationsService: OperationsService
  ) {}

  ngOnInit() {
    this.loadInvoices();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchQuery = searchTerm;
      this.currentPage = 1;
      this.invoices = [];
      this.hasMore = true;
      this.loadInvoices();
    });
  }

  loadInvoices(event?: any) {
    if (this.loading) return;
    
    this.loading = true;
    this.invoiceService.getInvoices(this.currentPage, 10, this.searchQuery)
      .subscribe({
        next: (response) => {
          if (this.currentPage === 1) {
            this.invoices = response.items;
          } else {
            this.invoices = [...this.invoices, ...response.items];
          }
          
          this.hasMore = this.currentPage < response.paging.totalPages;
          this.currentPage++;
          this.loading = false;
          
          if (event) {
            event.target.complete();
          }
        },
        error: (error) => {
          console.error('Error loading invoices:', error);
          this.loading = false;
          if (event) {
            event.target.complete();
          }
        }
      });
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value || '';
    this.searchSubject.next(searchTerm);
  }

  clearSearch() {
    this.searchSubject.next('');
  }

  onHeaderBackClick() {
    // Blur any focused element to prevent aria-hidden conflict
    // if (document.activeElement instanceof HTMLElement) {
    //   document.activeElement.blur();
    // }
    // this.navController.navigateRoot('/tabs/operations');
    this.operationsService.navigateToOperations();
  }

  openCreateForm() {
    this.formMode = 'create';
    this.selectedInvoice = null;
    this.showForm = true;
  }

  openReadForm(invoice: Invoice) {
    this.formMode = 'read';
    this.selectedInvoice = invoice;
    this.showForm = true;
  }

  openUpdateForm(invoice: Invoice) {
    this.formMode = 'update';
    this.selectedInvoice = invoice;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.formMode = null;
    this.selectedInvoice = null;
  }

  async confirmDelete(invoice: Invoice) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete invoice ${invoice.invoiceId}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteInvoice(invoice);
          }
        }
      ]
    });
    await alert.present();
  }

  private deleteInvoice(invoice: Invoice) {
    this.invoiceService.deleteInvoice(invoice.invoiceSeq).subscribe({
      next: () => {
        this.invoices = this.invoices.filter(d => d.invoiceSeq !== invoice.invoiceSeq);
      },
      error: (error) => {
        console.error('Error deleting invoice:', error);
      }
    });
  }

}
