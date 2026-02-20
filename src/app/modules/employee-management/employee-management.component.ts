import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController, IonSearchbar, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  CreateEmployeeWithUserPayload,
  EmployeeService,
  EmployeeWithUserItem,
  EmployeeWithUserRole,
  EmployeeWithUserUser
} from 'src/app/services/employee.service';
import { SortBy } from 'src/app/enums/sort-by.enum';
import { SortOrder } from 'src/app/enums/sort-order.enum';
import { ServerValidationErrors, extractServerValidationErrors } from 'src/app/utils/server-validation.util';
import { RoleItem, RoleService } from 'src/app/services/role.service';
import {
  DistrictItem,
  PincodeItem,
  ReferenceService,
  StateItem
} from 'src/app/services/reference.service';

export type EmployeeAction = 'list' | 'create' | 'view' | 'update' | 'delete';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
  standalone: false
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: IonSearchbar;

  readonly actions: EmployeeAction[] = ['list', 'create', 'view', 'update', 'delete'];

  action: EmployeeAction = 'list';
  employees: EmployeeWithUserItem[] = [];
  selectedEmployee: EmployeeWithUserItem | null = null;
  selectedEmployeeId: number | null = null;

  form: FormGroup;
  loading = false;
  submitting = false;

  currentPage = 1;
  hasMore = true;
  searchQuery = '';
  sortBy: SortBy = SortBy.SEQUENCE;
  sortOrder: SortOrder = SortOrder.DESC;

  serverValidationErrors: ServerValidationErrors = {};
  readonly countryName = 'India';
  roles: RoleItem[] = [];
  states: StateItem[] = [];
  districts: DistrictItem[] = [];
  pincodeOptions: PincodeItem[] = [];
  private readonly roleNameMap = new Map<number, string>();
  private launchedFromDashboard = false;

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
    private readonly employeeService: EmployeeService,
    private readonly roleService: RoleService,
    private readonly referenceService: ReferenceService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      addressLine3: [''],
      country: [{ value: this.countryName, disabled: true }],
      stateId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      salary: [0, [Validators.required, Validators.min(0)]],
      activeFlag: ['Y', [Validators.required]],
      roleId: [null, [Validators.required, Validators.min(1)]]
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => this.performSearch(query));
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadStates();
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.launchedFromDashboard = params.get('from') === 'dashboard';
      });
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => this.handleRouteChange(params));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get pageTitle(): string {
    switch (this.action) {
      case 'create':
        return 'Create Employee';
      case 'view':
        return 'View Employee';
      case 'update':
        return 'Update Employee';
      case 'delete':
        return 'Delete Employee';
      case 'list':
      default:
        return 'Employees';
    }
  }

  get isReadOnlyAction(): boolean {
    return this.action === 'view';
  }

  get showForm(): boolean {
    return this.action !== 'list' && this.action !== 'delete';
  }

  get nestedUser(): EmployeeWithUserUser | undefined {
    return this.selectedEmployee?.User ?? this.selectedEmployee?.user;
  }

  get roleIdFromSelection(): number | null {
    const role = this.nestedUser?.UserRoles?.[0] as EmployeeWithUserRole | undefined;
    return role?.roleId ?? this.selectedEmployee?.roleId ?? null;
  }

  getRoleNameById(roleId: number | null | undefined): string {
    if (!roleId) {
      return '-';
    }
    return this.roleNameMap.get(roleId) ?? String(roleId);
  }

  getEmployeeRoleLabel(employee: EmployeeWithUserItem): string {
    const nestedRole = (employee.User ?? employee.user)?.UserRoles?.[0] as EmployeeWithUserRole | undefined;
    const roleId = nestedRole?.roleId ?? employee.roleId ?? null;
    const roleName = nestedRole?.Role?.name;
    if (roleName) {
      return roleName;
    }
    return this.getRoleNameById(roleId);
  }

  loadEmployees(event?: CustomEvent, reset: boolean = false): void {
    if (this.loading || (!this.hasMore && !reset)) {
      event?.target && ((event.target as HTMLIonInfiniteScrollElement).complete());
      return;
    }

    if (reset) {
      this.currentPage = 1;
      this.hasMore = true;
      this.employees = [];
    }

    this.loading = true;

    this.employeeService
      .getEmployeesWithUser(this.currentPage, 10, this.searchQuery, this.sortBy, this.sortOrder)
      .subscribe({
        next: (response) => {
          const items = response?.items ?? [];
          this.employees = this.currentPage === 1 ? items : [...this.employees, ...items];
          this.hasMore = response?.paging?.currentPage < response?.paging?.totalPages;
          this.currentPage += 1;
          this.loading = false;
          event?.target && ((event.target as HTMLIonInfiniteScrollElement).complete());
        },
        error: async () => {
          this.loading = false;
          event?.target && ((event.target as HTMLIonInfiniteScrollElement).complete());
          await this.showToast('Failed to load employees', 'danger');
        }
      });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target?.value ?? '';
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  performSearch(query: string): void {
    this.searchQuery = query;
    this.loadEmployees(undefined, true);
  }

  openAction(action: EmployeeAction, id?: number): void {
    const queryParams = this.route.snapshot.queryParams;

    if (action === 'list') {
      this.router.navigate(['/employee', 'list'], { queryParams });
      return;
    }

    if (id != null) {
      this.router.navigate(['/employee', action, id], { queryParams });
      return;
    }

    this.router.navigate(['/employee', action], { queryParams });
  }

  onHeaderBackClick(): void {
    if (this.action === 'list') {
      this.router.navigate([this.launchedFromDashboard ? '/tabs/home' : '/tabs/profile-masters']);
      return;
    }

    this.openAction('list');
  }

  async confirmDeleteFromList(employee: EmployeeWithUserItem): Promise<void> {
    const username = (employee.User ?? employee.user)?.username ?? employee.userId;
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Delete employee "${username}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.performDelete(employee.userId, false)
        }
      ]
    });

    await alert.present();
  }

  async submit(): Promise<void> {
    if (this.action !== 'create' && this.action !== 'update') {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    this.submitting = true;
    this.serverValidationErrors = {};

    const payload = this.buildPayload();

    const request$ = this.action === 'create'
      ? this.employeeService.createEmployeeWithUser(payload)
      : this.employeeService.updateEmployeeWithUser(this.selectedEmployeeId as number, payload);

    request$.subscribe({
      next: async () => {
        this.submitting = false;
        await this.showToast(
          this.action === 'create' ? 'Employee created successfully' : 'Employee updated successfully',
          'success'
        );
        this.openAction('list');
      },
      error: async (error) => {
        this.submitting = false;
        this.serverValidationErrors = extractServerValidationErrors(error);
        if (Object.keys(this.serverValidationErrors).length === 0) {
          await this.showToast('Unable to save employee', 'danger');
        }
      }
    });
  }

  hasServerError(field: string): boolean {
    return (this.serverValidationErrors[field] ?? []).length > 0;
  }

  getServerErrorMessages(field: string): string[] {
    return this.serverValidationErrors[field] ?? [];
  }

  clearServerError(field: string): void {
    if (!this.hasServerError(field)) {
      return;
    }

    const { [field]: _, ...rest } = this.serverValidationErrors;
    this.serverValidationErrors = rest;
  }

  trackByEmployee(_: number, item: EmployeeWithUserItem): number {
    return item.employeeSequence;
  }

  onStateChanged(stateId: number | string | null): void {
    const parsedStateId = Number(stateId);
    if (!parsedStateId) {
      this.districts = [];
      this.form.patchValue({ districtId: null }, { emitEvent: false });
      return;
    }
    this.clearServerError('stateId');
    this.loadDistricts(parsedStateId);
  }

  onPincodeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const pincode = String(target?.value ?? '').trim();
    this.clearServerError('pincode');
    this.pincodeOptions = [];
    if (/^\d{6}$/.test(pincode)) {
      this.loadPincodes(pincode);
    }
  }

  private loadRoles(): void {
    this.roleService.getRoles(1, 100).subscribe({
      next: (response) => {
        this.roles = response?.items ?? [];
        this.roleNameMap.clear();
        this.roles.forEach((role) => this.roleNameMap.set(role.id, role.name));
      },
      error: async () => {
        this.roles = [];
        this.roleNameMap.clear();
        await this.showToast('Failed to load roles', 'danger');
      }
    });
  }

  private loadStates(): void {
    this.referenceService.getStates().subscribe({
      next: (response) => {
        this.states = response ?? [];
      },
      error: async () => {
        this.states = [];
        await this.showToast('Failed to load states', 'danger');
      }
    });
  }

  private loadDistricts(stateId: number, selectedDistrictName?: string): void {
    this.referenceService.getDistricts(stateId).subscribe({
      next: (response) => {
        this.districts = response ?? [];
        if (selectedDistrictName) {
          const district = this.districts.find(
            (item) => item.districtName.toLowerCase() === selectedDistrictName.toLowerCase()
          );
          this.form.patchValue({ districtId: district?.id ?? null }, { emitEvent: false });
        } else {
          this.form.patchValue({ districtId: null }, { emitEvent: false });
        }
      },
      error: async () => {
        this.districts = [];
        this.form.patchValue({ districtId: null }, { emitEvent: false });
        if (!selectedDistrictName) {
          await this.showToast('Failed to load districts', 'danger');
        }
      }
    });
  }

  private loadPincodes(pincode: string): void {
    this.referenceService.getPincodes(pincode).subscribe({
      next: (response) => {
        this.pincodeOptions = response ?? [];
      },
      error: async () => {
        this.pincodeOptions = [];
        await this.showToast('Failed to validate pincode', 'danger');
      }
    });
  }

  private handleRouteChange(params: ParamMap): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const actionFromRoutePath = (routePath.split('/')[0] || 'list') as EmployeeAction;
    const actionParam = params.get('action') as EmployeeAction | null;
    const actionCandidate = actionParam ?? actionFromRoutePath;
    const action = actionCandidate && this.actions.includes(actionCandidate) ? actionCandidate : 'list';
    const idParam = params.get('path-param');
    const id = idParam ? Number(idParam) : null;

    this.action = action;
    this.selectedEmployeeId = Number.isFinite(id) ? id : null;
    this.serverValidationErrors = {};

    if (action === 'list') {
      this.form.reset();
      this.selectedEmployee = null;
      this.loadEmployees(undefined, true);
      return;
    }

    if (action === 'create') {
      this.initCreateForm();
      return;
    }

    if (!this.selectedEmployeeId) {
      this.openAction('list');
      return;
    }

    if (action === 'delete') {
      this.confirmDeleteFromRoute(this.selectedEmployeeId);
      return;
    }

    this.loadEmployeeDetails(this.selectedEmployeeId);
  }

  private initCreateForm(): void {
    this.selectedEmployee = null;
    this.form.reset({
      username: '',
      firstName: '',
      lastName: '',
      name: '',
      email: '',
      mobile: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      country: this.countryName,
      stateId: null,
      districtId: null,
      pincode: '',
      password: '',
      salary: 0,
      activeFlag: 'Y',
      roleId: null
    });
    this.districts = [];
    this.pincodeOptions = [];

    this.form.enable();
    this.form.controls['password'].setValidators([Validators.required, Validators.minLength(8)]);
    this.form.controls['password'].updateValueAndValidity();
  }

  private loadEmployeeDetails(userId: number): void {
    this.loading = true;

    this.employeeService.getEmployeeWithUser(userId).subscribe({
      next: (employee) => {
        this.selectedEmployee = employee;
        this.patchFormFromEmployee(employee);
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Failed to load employee details', 'danger');
        this.openAction('list');
      }
    });
  }

  private patchFormFromEmployee(employee: EmployeeWithUserItem): void {
    const user = employee.User ?? employee.user;
    const roleId = this.roleIdFromSelection;
    const parsedAddress = this.parseAddress(user?.address ?? '');

    this.form.reset({
      username: user?.username ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      mobile: user?.mobile ?? '',
      addressLine1: parsedAddress.addressLine1,
      addressLine2: parsedAddress.addressLine2,
      addressLine3: parsedAddress.addressLine3,
      country: this.countryName,
      stateId: parsedAddress.stateId,
      districtId: parsedAddress.districtId,
      pincode: parsedAddress.pincode,
      password: '',
      salary: employee.salary ?? 0,
      activeFlag: employee.activeFlag ?? 'Y',
      roleId
    });
    this.pincodeOptions = /^\d{6}$/.test(parsedAddress.pincode)
      ? [{ id: 0, postOfficeName: '', pincode: parsedAddress.pincode, stateName: '' }]
      : [];

    if (parsedAddress.stateId) {
      this.loadDistricts(parsedAddress.stateId, parsedAddress.districtName);
    } else {
      this.districts = [];
    }

    if (this.action === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].setValidators([Validators.minLength(8)]);
      this.form.controls['password'].updateValueAndValidity();
    }
  }

  private async confirmDeleteFromRoute(userId: number): Promise<void> {
    this.employeeService.getEmployeeWithUser(userId).subscribe({
      next: async (employee) => {
        const username = (employee.User ?? employee.user)?.username ?? employee.userId;
        const alert = await this.alertController.create({
          header: 'Confirm Delete',
          message: `Delete employee "${username}"?`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => this.openAction('list')
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => this.performDelete(userId, true)
            }
          ]
        });

        await alert.present();
      },
      error: async () => {
        await this.showToast('Failed to load employee for delete', 'danger');
        this.openAction('list');
      }
    });
  }

  private performDelete(userId: number, navigateToListAfterDelete: boolean): void {
    this.employeeService.deleteEmployeeWithUser(userId).subscribe({
      next: async () => {
        this.employees = this.employees.filter((item) => item.userId !== userId);
        await this.showToast('Employee deleted successfully', 'success');

        if (navigateToListAfterDelete) {
          this.openAction('list');
        }
      },
      error: async () => {
        await this.showToast('Failed to delete employee', 'danger');
        if (navigateToListAfterDelete) {
          this.openAction('list');
        }
      }
    });
  }

  private buildPayload(): CreateEmployeeWithUserPayload {
    const value = this.form.getRawValue();
    const stateName = this.states.find((item) => item.id === Number(value.stateId))?.stateName ?? '';
    const districtName = this.districts.find((item) => item.id === Number(value.districtId))?.districtName ?? '';
    const pincode = String(value.pincode ?? '').trim();
    const composedAddress = [
      String(value.addressLine1 ?? '').trim(),
      String(value.addressLine2 ?? '').trim(),
      String(value.addressLine3 ?? '').trim(),
      districtName,
      stateName,
      this.countryName,
      pincode
    ]
      .filter((part) => part.length > 0)
      .join(', ');

    const user: CreateEmployeeWithUserPayload['user'] = {
      username: String(value.username ?? '').trim(),
      firstName: String(value.firstName ?? '').trim(),
      lastName: String(value.lastName ?? '').trim(),
      name: String(value.name ?? '').trim(),
      email: String(value.email ?? '').trim(),
      mobile: String(value.mobile ?? '').trim(),
      address: composedAddress
    };

    const password = String(value.password ?? '').trim();
    if (this.action === 'create' || password.length > 0) {
      user.password = password;
    }

    return {
      user,
      employee: {
        salary: Number(value.salary),
        activeFlag: value.activeFlag
      },
      roleUser: {
        roleId: Number(value.roleId)
      }
    };
  }

  private parseAddress(address: string): {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    stateId: number | null;
    districtId: number | null;
    districtName: string;
    pincode: string;
  } {
    const parts = address
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    let pincode = '';
    if (parts.length > 0 && /^\d{6}$/.test(parts[parts.length - 1])) {
      pincode = parts.pop() as string;
    }

    if (parts.length > 0) {
      const countryPart = parts[parts.length - 1];
      if (countryPart.toLowerCase() === this.countryName.toLowerCase()) {
        parts.pop();
      }
    }

    let stateId: number | null = null;
    let districtName = '';

    if (parts.length > 0) {
      const stateName = parts[parts.length - 1];
      const matchedState = this.states.find(
        (item) => item.stateName.toLowerCase() === stateName.toLowerCase()
      );
      if (matchedState) {
        stateId = matchedState.id;
        parts.pop();
      }
    }

    if (parts.length > 0) {
      districtName = parts.pop() as string;
    }

    return {
      addressLine1: parts[0] ?? '',
      addressLine2: parts[1] ?? '',
      addressLine3: parts.slice(2).join(', '),
      stateId,
      districtId: null,
      districtName,
      pincode
    };
  }

  private async showToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });

    await toast.present();
  }
}
