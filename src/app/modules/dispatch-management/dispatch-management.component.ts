import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Dispatch } from '../../models/dispatch.model';
import { DispatchService } from '../../services/dispatch.service';
import { OperationsService } from 'src/app/services/operations.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';
import { ConfirmDialogService } from '../../components/confirm-dialog-modal/confirm-dialog.service';

@Component({
  selector: 'app-dispatch-management',
  templateUrl: './dispatch-management.component.html',
  styleUrls: ['./dispatch-management.component.scss'],
  standalone: false
})
export class DispatchManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  dispatches: Dispatch[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedDispatch: Dispatch | null = null;
  showForm = false;
  currentPage = 1;
  hasMore = true;
  loading = false;
  searchQuery: string = '';
  serverValidationErrors: ServerValidationErrors = {};

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private readonly confirmDialog: ConfirmDialogService,
    private navCtrl: NavController,
    private dispatchService: DispatchService,
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
    console.log('Dispatch Management Component Initialized');
    this.loadDispatches();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadDispatches(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.dispatchService.getDispatches(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.dispatches = response.items;
        } else {
          this.dispatches = [...this.dispatches, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading dispatches:', error);
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
    this.dispatches = [];
    this.loadDispatches();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedDispatch = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(dispatch: Dispatch) {
    this.dispatchService.getDispatch(dispatch.dispatchSequence).subscribe({
      next: (dispatchDetails) => {
        this.selectedDispatch = dispatchDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading dispatch details:', error);
      }
    });
  }

  openUpdateForm(dispatch: Dispatch) {
    this.dispatchService.getDispatch(dispatch.dispatchSequence).subscribe({
      next: (dispatchDetails) => {
        this.selectedDispatch = dispatchDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading dispatch details:', error);
      }
    });
  }

  async confirmDelete(dispatch: Dispatch) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete dispatch "${dispatch.dispatchId}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.deleteDispatch(dispatch);
  }

  deleteDispatch(dispatch: Dispatch) {
    this.dispatchService.deleteDispatch(dispatch.dispatchSequence).subscribe({
      next: () => {
        this.dispatches = this.dispatches.filter(d => d.dispatchSequence !== dispatch.dispatchSequence);
        console.log('Dispatch deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting dispatch:', error);
      }
    });
  }

  handleFormSubmit(formData: Dispatch) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.dispatchService.createDispatch(formData).subscribe({
        next: (newDispatch) => {
          this.dispatches.unshift(newDispatch);
          this.closeForm();
          console.log('Dispatch created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating dispatch:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedDispatch) {
      this.dispatchService.updateDispatch(this.selectedDispatch.dispatchSequence, formData).subscribe({
        next: (updatedDispatch) => {
          const index = this.dispatches.findIndex(d => d.dispatchSequence === this.selectedDispatch?.dispatchSequence);
          if (index > -1) {
            this.dispatches[index] = updatedDispatch;
          }
          this.closeForm();
          console.log('Dispatch updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating dispatch:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedDispatch = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.operationsService.navigateToOperations();
  }
}
