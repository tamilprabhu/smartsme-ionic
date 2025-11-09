import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ProductionShiftPage } from './production-shift.page';

describe('ProductionShiftPage', () => {
  let component: ProductionShiftPage;
  let fixture: ComponentFixture<ProductionShiftPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionShiftPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionShiftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
