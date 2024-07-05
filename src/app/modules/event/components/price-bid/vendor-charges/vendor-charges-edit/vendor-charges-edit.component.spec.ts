import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorChargesEditComponent } from './vendor-charges-edit.component';

describe('VendorChargesEditComponent', () => {
  let component: VendorChargesEditComponent;
  let fixture: ComponentFixture<VendorChargesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorChargesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorChargesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
