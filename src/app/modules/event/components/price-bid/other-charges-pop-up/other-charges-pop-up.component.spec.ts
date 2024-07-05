import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherChargesPopUpComponent } from './other-charges-pop-up.component';

describe('OtherChargesPopUpComponent', () => {
  let component: OtherChargesPopUpComponent;
  let fixture: ComponentFixture<OtherChargesPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherChargesPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherChargesPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
