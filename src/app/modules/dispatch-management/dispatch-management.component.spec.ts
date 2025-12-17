import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchManagementComponent } from './dispatch-management.component';

describe('DispatchManagementComponent', () => {
  let component: DispatchManagementComponent;
  let fixture: ComponentFixture<DispatchManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
