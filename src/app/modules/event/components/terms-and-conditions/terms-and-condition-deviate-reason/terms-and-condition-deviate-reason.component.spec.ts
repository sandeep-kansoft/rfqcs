import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionDeviateReasonComponent } from './terms-and-condition-deviate-reason.component';

describe('TermsAndConditionDeviateReasonComponent', () => {
  let component: TermsAndConditionDeviateReasonComponent;
  let fixture: ComponentFixture<TermsAndConditionDeviateReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionDeviateReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionDeviateReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
