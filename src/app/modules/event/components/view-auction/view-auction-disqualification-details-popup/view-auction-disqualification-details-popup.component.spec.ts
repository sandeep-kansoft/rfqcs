import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuctionDisqualificationDetailsPopupComponent } from './view-auction-disqualification-details-popup.component';

describe('ViewAuctionDisqualificationDetailsPopupComponent', () => {
  let component: ViewAuctionDisqualificationDetailsPopupComponent;
  let fixture: ComponentFixture<ViewAuctionDisqualificationDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAuctionDisqualificationDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAuctionDisqualificationDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
