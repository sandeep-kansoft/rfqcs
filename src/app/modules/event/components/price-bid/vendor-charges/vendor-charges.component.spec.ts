import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorChargesComponent } from './vendor-charges.component';

describe('VendorChargesComponent', () => {
  let component: VendorChargesComponent;
  let fixture: ComponentFixture<VendorChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
