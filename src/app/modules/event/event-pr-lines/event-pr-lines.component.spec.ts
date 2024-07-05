import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPrLinesComponent } from './event-pr-lines.component';

describe('EventPrLinesComponent', () => {
  let component: EventPrLinesComponent;
  let fixture: ComponentFixture<EventPrLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventPrLinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventPrLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
