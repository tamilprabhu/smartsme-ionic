import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, NavController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProductionEntry, ProductionShift } from '../../models/production-shift.model';
import { ProductionShiftService } from '../../services/production-shift.service';
import { OperationsService } from 'src/app/services/operations.service';

@Component({
  selector: 'app-production-shift',
  templateUrl: 'production-shift.page.html',
  styleUrls: ['production-shift.page.scss'],
  standalone: false,
})
export class ProductionShiftPage implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  productionShifts: ProductionShift[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedShift: ProductionShift | null = null;
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
    private productionShiftService: ProductionShiftService,
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
    this.loadProductionShifts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadProductionShifts(event?: any) {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    this.productionShiftService.getProductionShifts(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.productionShifts = response.items;
        } else {
          this.productionShifts = [...this.productionShifts, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading production shifts:', error);
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value || '';
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.hasMore = true;
    this.productionShifts = [];
    this.loadProductionShifts();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedShift = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(shift: ProductionShift) {
    this.productionShiftService.getProductionShift(shift.shiftIdSeq).subscribe({
      next: (shiftDetails) => {
        this.selectedShift = shiftDetails;
        this.formMode = 'read';
        this.showForm = true;
      }
    });
  }

  openUpdateForm(shift: ProductionShift) {
    this.productionShiftService.getProductionShift(shift.shiftIdSeq).subscribe({
      next: (shiftDetails) => {
        this.selectedShift = shiftDetails;
        this.formMode = 'update';
        this.showForm = true;
      }
    });
  }

  async confirmDelete(shift: ProductionShift) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete production shift "${shift.shiftId}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteShift(shift) }
      ]
    });
    await alert.present();
  }

  deleteShift(shift: ProductionShift) {
    this.productionShiftService.deleteProductionShift(shift.shiftIdSeq).subscribe({
      next: () => {
        this.productionShifts = this.productionShifts.filter(s => s.shiftIdSeq !== shift.shiftIdSeq);
      }
    });
  }

  handleFormSubmit(formData: ProductionShift) {
    if (this.formMode === 'create') {
      this.productionShiftService.createProductionShift(formData).subscribe({
        next: (newShift) => {
          this.productionShifts.unshift(newShift);
          this.closeForm();
        }
      });
    } else if (this.formMode === 'update' && this.selectedShift) {
      this.productionShiftService.updateProductionShift(this.selectedShift.shiftIdSeq, formData).subscribe({
        next: (updatedShift) => {
          const index = this.productionShifts.findIndex(s => s.shiftIdSeq === this.selectedShift?.shiftIdSeq);
          if (index > -1) this.productionShifts[index] = updatedShift;
          this.closeForm();
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedShift = null;
    this.formMode = null;
  }

  onHeaderBackClick() {
    this.operationsService.navigateToOperations();
  }
}
