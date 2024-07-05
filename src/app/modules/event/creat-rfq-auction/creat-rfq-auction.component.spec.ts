import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatRfqAuctionComponent } from './creat-rfq-auction.component';

describe('CreatRfqAuctionComponent', () => {
  let component: CreatRfqAuctionComponent;
  let fixture: ComponentFixture<CreatRfqAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatRfqAuctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatRfqAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
