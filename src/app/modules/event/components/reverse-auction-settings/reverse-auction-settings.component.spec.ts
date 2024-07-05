import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseAuctionSettingsComponent } from './reverse-auction-settings.component';

describe('ReverseAuctionSettingsComponent', () => {
  let component: ReverseAuctionSettingsComponent;
  let fixture: ComponentFixture<ReverseAuctionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseAuctionSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseAuctionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
