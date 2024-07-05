import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBidPopUpComponent } from './submit-bid-pop-up.component';

describe('SubmitBidPopUpComponent', () => {
  let component: SubmitBidPopUpComponent;
  let fixture: ComponentFixture<SubmitBidPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitBidPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitBidPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
