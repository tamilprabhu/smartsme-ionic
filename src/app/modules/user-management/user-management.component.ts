import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: false
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  users: User[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedUser: User | null = null;
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
    private userService: UserService
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
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  loadUsers(event?: any) {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    this.userService.getUsers(this.currentPage, 10, this.searchQuery).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.users = response.items;
        } else {
          this.users = [...this.users, ...response.items];
        }
        this.hasMore = response.paging.currentPage < response.paging.totalPages;
        this.currentPage++;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: (error) => {
        console.error('Error loading users:', error);
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
    this.users = [];
    this.loadUsers();
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';
    this.performSearch('');
  }

  openCreateForm() {
    this.selectedUser = null;
    this.formMode = 'create';
    this.serverValidationErrors = {};
    this.showForm = true;
  }

  openReadForm(user: User) {
    this.userService.getUser(user.id).subscribe({
      next: (userDetails) => {
        this.selectedUser = userDetails;
        this.formMode = 'read';
        this.serverValidationErrors = {};
        this.showForm = true;
      }
    });
  }

  openUpdateForm(user: User) {
    this.userService.getUser(user.id).subscribe({
      next: (userDetails) => {
        this.selectedUser = userDetails;
        this.formMode = 'update';
        this.serverValidationErrors = {};
        this.showForm = true;
      }
    });
  }

  async confirmDelete(user: User) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete user "${user.username}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteUser(user) }
      ]
    });
    await alert.present();
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
      }
    });
  }

  handleFormSubmit(formData: User) {
    this.serverValidationErrors = {};

    if (this.formMode === 'create') {
      this.userService.createUser(formData).subscribe({
        next: (newUser) => {
          this.users.unshift(newUser);
          this.closeForm();
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error creating user:', error);
        }
      });
    } else if (this.formMode === 'update' && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, formData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === this.selectedUser?.id);
          if (index > -1) this.users[index] = updatedUser;
          this.closeForm();
        },
        error: (error) => {
          this.serverValidationErrors = extractServerValidationErrors(error);
          console.error('Error updating user:', error);
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedUser = null;
    this.formMode = null;
    this.serverValidationErrors = {};
  }

  onHeaderBackClick() {
    this.router.navigate(['/tabs/profile-masters']);
  }
}
