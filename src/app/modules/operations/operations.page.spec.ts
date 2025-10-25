import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { OperationsPage } from './opearations.page';

describe('OperationsPage', () => {
  let component: OperationsPage;
  let fixture: ComponentFixture<OperationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
