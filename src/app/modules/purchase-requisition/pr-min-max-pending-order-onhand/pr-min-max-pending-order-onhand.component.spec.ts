import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrMinMaxPendingOrderOnhandComponent } from './pr-min-max-pending-order-onhand.component';

describe('PrMinMaxPendingOrderOnhandComponent', () => {
  let component: PrMinMaxPendingOrderOnhandComponent;
  let fixture: ComponentFixture<PrMinMaxPendingOrderOnhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrMinMaxPendingOrderOnhandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrMinMaxPendingOrderOnhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
