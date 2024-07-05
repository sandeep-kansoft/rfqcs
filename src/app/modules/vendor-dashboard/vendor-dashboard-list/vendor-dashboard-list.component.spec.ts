import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashboardListComponent } from './vendor-dashboard-list.component';

describe('VendorDashboardListComponent', () => {
  let component: VendorDashboardListComponent;
  let fixture: ComponentFixture<VendorDashboardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorDashboardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

