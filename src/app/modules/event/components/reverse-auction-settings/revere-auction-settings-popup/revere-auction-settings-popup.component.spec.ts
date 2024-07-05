import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevereAuctionSettingsPopupComponent } from './revere-auction-settings-popup.component';

describe('RevereAuctionSettingsPopupComponent', () => {
  let component: RevereAuctionSettingsPopupComponent;
  let fixture: ComponentFixture<RevereAuctionSettingsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevereAuctionSettingsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevereAuctionSettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
