import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToAuctionComponent } from './go-to-auction.component';

describe('GoToAuctionComponent', () => {
  let component: GoToAuctionComponent;
  let fixture: ComponentFixture<GoToAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoToAuctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoToAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
