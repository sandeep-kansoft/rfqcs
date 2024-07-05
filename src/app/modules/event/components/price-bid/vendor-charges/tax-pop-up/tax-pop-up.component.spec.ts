import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPopUpComponent } from './tax-pop-up.component';

describe('TaxPopUpComponent', () => {
  let component: TaxPopUpComponent;
  let fixture: ComponentFixture<TaxPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
