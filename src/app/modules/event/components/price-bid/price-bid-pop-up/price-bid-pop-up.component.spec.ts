import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBidPopUpComponent } from './price-bid-pop-up.component';

describe('PriceBidPopUpComponent', () => {
  let component: PriceBidPopUpComponent;
  let fixture: ComponentFixture<PriceBidPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceBidPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceBidPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
