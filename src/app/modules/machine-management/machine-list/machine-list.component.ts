import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, IonSearchbar, IonicModule } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ConfirmDialogService } from 'src/app/components/confirm-dialog-modal/confirm-dialog.service';
import { Machine } from 'src/app/models/machine.model';
import { MachineService } from 'src/app/services/machine.service';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HeaderComponent]
})
export class MachineListComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  machines: Machine[] = [];
  currentPage = 1;
  hasMore = true;
  loading = false;
  listError = '';

  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly destroy$ = new Subject<void>();
  private backTarget = '/tabs/profile-masters';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly machineService: MachineService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.backTarget = this.route.snapshot.queryParamMap.get('from') === 'dashboard'
      ? '/tabs/home'
      : '/tabs/profile-masters';

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetListing();
        this.loadMachines();
      });

    this.loadMachines();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMachines(event?: CustomEvent): void {
    if (this.loading || !this.hasMore) {
      this.completeInfinite(event);
      return;
    }

    this.loading = true;
    this.listError = '';

    this.machineService.getMachines(this.currentPage, 10, this.searchControl.value).subscribe({
      next: (response) => {
        this.machines = this.currentPage === 1 ? response.items : [...this.machines, ...response.items];
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage += 1;
        this.loading = false;
        this.completeInfinite(event);
      },
      error: (error) => {
        this.loading = false;
        this.listError = error?.error?.error || error?.message || 'Failed to load machines';
        this.completeInfinite(event);
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event as CustomEvent).detail?.value ?? '';
    this.searchControl.setValue(value, { emitEvent: true });
  }

  clearSearch(): void {
    this.searchControl.setValue('', { emitEvent: true });
    if (this.searchInput) {
      this.searchInput.value = '';
    }
  }

  createMachine(): void {
    this.router.navigate(['/machine/create']);
  }

  viewMachine(machine: Machine): void {
    this.router.navigate(['/machine', machine.machineSequence]);
  }

  editMachine(machine: Machine, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/machine', machine.machineSequence, 'edit']);
  }

  async confirmDelete(machine: Machine, event: Event): Promise<void> {
    event.stopPropagation();

    const confirmed = await this.confirmDialog.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete machine "${machine.machineName}"?`,
      confirmText: 'Delete',
      confirmColor: 'danger'
    });

    if (!confirmed) return;

    this.machineService.deleteMachine(machine.machineSequence).subscribe({
      next: () => {
        this.resetListing();
        this.loadMachines();
      },
      error: () => {
        this.listError = 'Failed to delete machine';
      }
    });
  }

  onHeaderBackClick(): void {
    this.router.navigate([this.backTarget]);
  }

  trackByMachineSequence(_index: number, machine: Machine): number {
    return machine.machineSequence;
  }

  private resetListing(): void {
    this.currentPage = 1;
    this.hasMore = true;
    this.machines = [];
  }

  private completeInfinite(event?: CustomEvent): void {
    const target = event?.target as IonInfiniteScroll | undefined;
    target?.complete();
  }
}
