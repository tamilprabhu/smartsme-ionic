import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Machine } from '../../models/machine.model';
import { MachineService } from '../../services/machine.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';
import { ConfirmDialogService } from '../../components/confirm-dialog-modal/confirm-dialog.service';

@Component({
  selector: 'app-machine-management',
  templateUrl: './machine-management.component.html',
  styleUrls: ['./machine-management.component.scss'],
  standalone: false
})
export class MachineManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  machines: Machine[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedMachine: Machine | null = null;
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
    private readonly confirmDialog: ConfirmDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private machineService: MachineService
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
    console.log('Machine Management Component Initialized');
    this.backTarget = this.route.snapshot.queryParamMap.get('from') === 'dashboard'
      ? '/tabs/home'
      : '/tabs/profile-masters';
    this.loadMachines();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadMachines(event?: any) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.machineService.getMachines(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.machines = response.items;
        } else {
          this.machines = [...this.machines, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading machines:', error);
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
    this.machines = [];
    this.loadMachines();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedMachine = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(machine: Machine) {
    this.machineService.getMachine(machine.machineSequence).subscribe({
      next: (machineDetails) => {
        this.selectedMachine = machineDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading machine details:', error);
      }
    });
  }

  openUpdateForm(machine: Machine) {
    this.machineService.getMachine(machine.machineSequence).subscribe({
      next: (machineDetails) => {
        this.selectedMachine = machineDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error loading machine details:', error);
      }
    });
  }

  async confirmDelete(machine: Machine) {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete machine "${machine.machineName}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.deleteMachine(machine);
  }

  deleteMachine(machine: Machine) {
    this.machineService.deleteMachine(machine.machineSequence).subscribe({
      next: () => {
        this.machines = this.machines.filter(m => m.machineSequence !== machine.machineSequence);
        console.log('Machine deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting machine:', error);
      }
    });
  }

  handleFormSubmit(formData: Machine) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.machineService.createMachine(formData).subscribe({
        next: (newMachine) => {
          this.machines.unshift(newMachine);
          this.closeForm();
          console.log('Machine created successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating machine:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedMachine) {
      this.machineService.updateMachine(this.selectedMachine.machineSequence, formData).subscribe({
        next: (updatedMachine) => {
          const index = this.machines.findIndex(m => m.machineSequence === this.selectedMachine?.machineSequence);
          if (index > -1) {
            this.machines[index] = updatedMachine;
          }
          this.closeForm();
          console.log('Machine updated successfully');
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating machine:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedMachine = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    console.log('Header back button clicked - navigating back');
    this.router.navigate([this.backTarget]);
  }
}
