import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBidComponent } from './price-bid.component';

describe('PriceBidComponent', () => {
  let component: PriceBidComponent;
  let fixture: ComponentFixture<PriceBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceBidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
