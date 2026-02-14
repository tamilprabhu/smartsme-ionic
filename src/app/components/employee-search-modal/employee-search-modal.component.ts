import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeDropdownItem, EmployeeService } from 'src/app/services/employee.service';
import { ItemsPerPage } from 'src/app/constants/pagination';

@Component({
  selector: 'app-employee-search-modal',
  templateUrl: './employee-search-modal.component.html',
  styleUrls: ['./employee-search-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmployeeSearchModalComponent implements OnInit {
  @Input() title = 'Select Employee';
  @Input() roleNames: string[] = [];
  @Input() selectedValue: number | null = null;
  @Input() allowClear = false;

  items: EmployeeDropdownItem[] = [];
  searchTerm = '';
  page = 1;
  totalPages = 1;
  loading = false;
  errorMessage = '';
  private searchTimeout?: number;

  constructor(
    private employeeService: EmployeeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadPage(1);
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = window.setTimeout(() => {
      this.loadPage(1);
    }, 300);
  }

  loadMore() {
    if (this.loading || this.page >= this.totalPages) {
      return;
    }
    this.loadPage(this.page + 1, true);
  }

  selectItem(item: EmployeeDropdownItem) {
    this.modalController.dismiss(item, 'select');
  }

  clearSelection() {
    this.modalController.dismiss(null, 'clear');
  }

  close() {
    this.modalController.dismiss(null, 'cancel');
  }

  isSelected(item: EmployeeDropdownItem): boolean {
    return item.value === this.selectedValue;
  }

  private loadPage(page: number, append: boolean = false) {
    this.loading = true;
    this.errorMessage = '';
    this.employeeService.getEmployeesByRole(this.roleNames, page, ItemsPerPage.TEN, this.searchTerm).subscribe({
      next: (response) => {
        this.page = response.paging.currentPage;
        this.totalPages = response.paging.totalPages;
        this.items = append ? [...this.items, ...response.items] : response.items;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Failed to load employees';
        this.loading = false;
      }
    });
  }
}
