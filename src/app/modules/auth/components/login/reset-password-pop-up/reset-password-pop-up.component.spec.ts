import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPopUpComponent } from './reset-password-pop-up.component';

describe('ResetPasswordPopUpComponent', () => {
  let component: ResetPasswordPopUpComponent;
  let fixture: ComponentFixture<ResetPasswordPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
