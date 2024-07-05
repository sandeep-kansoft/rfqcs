import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinMaxPrPurchaseOrderComponent } from './min-max-pr-purchase-order.component';

describe('MinMaxPrPurchaseOrderComponent', () => {
  let component: MinMaxPrPurchaseOrderComponent;
  let fixture: ComponentFixture<MinMaxPrPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinMaxPrPurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinMaxPrPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
