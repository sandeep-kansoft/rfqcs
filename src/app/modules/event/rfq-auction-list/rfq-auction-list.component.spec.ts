import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqAuctionListComponent } from './rfq-auction-list.component';

describe('RfqAuctionListComponent', () => {
  let component: RfqAuctionListComponent;
  let fixture: ComponentFixture<RfqAuctionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqAuctionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqAuctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
