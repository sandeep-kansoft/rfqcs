import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsAppovalSubmitPopupComponent } from './cs-appoval-submit-popup.component';

describe('CsAppovalSubmitPopupComponent', () => {
  let component: CsAppovalSubmitPopupComponent;
  let fixture: ComponentFixture<CsAppovalSubmitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsAppovalSubmitPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsAppovalSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
