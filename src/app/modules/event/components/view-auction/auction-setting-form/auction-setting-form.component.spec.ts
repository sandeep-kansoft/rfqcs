import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionSettingFormComponent } from './auction-setting-form.component';

describe('AuctionSettingFormComponent', () => {
  let component: AuctionSettingFormComponent;
  let fixture: ComponentFixture<AuctionSettingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionSettingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
