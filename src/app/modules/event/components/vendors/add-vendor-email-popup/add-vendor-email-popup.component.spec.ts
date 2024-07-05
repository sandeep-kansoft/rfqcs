import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorEmailPopupComponent } from './add-vendor-email-popup.component';

describe('AddVendorEmailPopupComponent', () => {
  let component: AddVendorEmailPopupComponent;
  let fixture: ComponentFixture<AddVendorEmailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorEmailPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVendorEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
