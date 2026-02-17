import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmployeeManagementComponent } from './employee-management.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';
import { ReferenceService } from 'src/app/services/reference.service';

class EmployeeServiceStub {
  getEmployeesWithUser() {
    return of({ items: [], paging: { currentPage: 1, totalPages: 1, itemsPerPage: 10, totalItems: 0 } });
  }
  getEmployeeWithUser() {
    return of();
  }
}

class RoleServiceStub {
  getRoles() {
    return of({ items: [], paging: { currentPage: 1, totalPages: 1, itemsPerPage: 10, totalItems: 0 } });
  }
}

class ReferenceServiceStub {
  getStates() {
    return of([]);
  }
  getDistricts() {
    return of([]);
  }
  getPincodes() {
    return of([]);
  }
}

describe('EmployeeManagementComponent', () => {
  let component: EmployeeManagementComponent;
  let fixture: ComponentFixture<EmployeeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeManagementComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: EmployeeService, useClass: EmployeeServiceStub },
        { provide: RoleService, useClass: RoleServiceStub },
        { provide: ReferenceService, useClass: ReferenceServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
