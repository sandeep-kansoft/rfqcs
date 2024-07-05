import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidOptimizationComponent } from './bid-optimization.component';

describe('BidOptimizationComponent', () => {
  let component: BidOptimizationComponent;
  let fixture: ComponentFixture<BidOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidOptimizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
