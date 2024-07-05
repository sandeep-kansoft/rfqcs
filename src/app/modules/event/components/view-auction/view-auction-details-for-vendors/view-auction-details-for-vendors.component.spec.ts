import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuctionDetailsForVendorsComponent } from './view-auction-details-for-vendors.component';

describe('ViewAuctionDetailsForVendorsComponent', () => {
  let component: ViewAuctionDetailsForVendorsComponent;
  let fixture: ComponentFixture<ViewAuctionDetailsForVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAuctionDetailsForVendorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAuctionDetailsForVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
