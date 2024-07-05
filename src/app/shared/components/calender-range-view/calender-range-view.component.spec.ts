import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderRangeViewComponent } from './calender-range-view.component';

describe('CalenderRangeViewComponent', () => {
  let component: CalenderRangeViewComponent;
  let fixture: ComponentFixture<CalenderRangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderRangeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderRangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
