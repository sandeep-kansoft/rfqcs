import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReActiveEventStatusDashboardComponent } from './re-active-event-status-dashboard.component';

describe('ReActiveEventStatusDashboardComponent', () => {
  let component: ReActiveEventStatusDashboardComponent;
  let fixture: ComponentFixture<ReActiveEventStatusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReActiveEventStatusDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReActiveEventStatusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
