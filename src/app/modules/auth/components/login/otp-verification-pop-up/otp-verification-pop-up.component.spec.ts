import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationPopUpComponent } from './otp-verification-pop-up.component';

describe('OtpVerificationPopUpComponent', () => {
  let component: OtpVerificationPopUpComponent;
  let fixture: ComponentFixture<OtpVerificationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpVerificationPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerificationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
