import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPendingCsPopupComponent } from './review-pending-cs-popup.component';

describe('ReviewPendingCsPopupComponent', () => {
  let component: ReviewPendingCsPopupComponent;
  let fixture: ComponentFixture<ReviewPendingCsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewPendingCsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewPendingCsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
