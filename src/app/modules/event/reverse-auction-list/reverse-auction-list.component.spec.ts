import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseAuctionListComponent } from './reverse-auction-list.component';

describe('ReverseAuctionListComponent', () => {
  let component: ReverseAuctionListComponent;
  let fixture: ComponentFixture<ReverseAuctionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseAuctionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseAuctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
