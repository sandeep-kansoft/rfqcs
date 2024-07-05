import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionVendorDeviationComponent } from './terms-and-condition-vendor-deviation.component';

describe('TermsAndConditionVendorDeviationComponent', () => {
  let component: TermsAndConditionVendorDeviationComponent;
  let fixture: ComponentFixture<TermsAndConditionVendorDeviationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionVendorDeviationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionVendorDeviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
