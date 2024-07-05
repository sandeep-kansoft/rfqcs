import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBidPoHistoryComponent } from './price-bid-po-history.component';

describe('PriceBidPoHistoryComponent', () => {
  let component: PriceBidPoHistoryComponent;
  let fixture: ComponentFixture<PriceBidPoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceBidPoHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceBidPoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
