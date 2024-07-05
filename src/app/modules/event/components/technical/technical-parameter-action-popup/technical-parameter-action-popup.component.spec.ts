import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalParameterActionPopupComponent } from './technical-parameter-action-popup.component';

describe('TechnicalParameterActionPopupComponent', () => {
  let component: TechnicalParameterActionPopupComponent;
  let fixture: ComponentFixture<TechnicalParameterActionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalParameterActionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalParameterActionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
