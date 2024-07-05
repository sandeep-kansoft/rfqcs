import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkSubmitPopupComponent } from './remark-submit-popup.component';

describe('RemarkSubmitPopupComponent', () => {
  let component: RemarkSubmitPopupComponent;
  let fixture: ComponentFixture<RemarkSubmitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkSubmitPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
