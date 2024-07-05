import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrLineHistoryGridComponent } from './pr-line-history-grid.component';

describe('PrLineHistoryGridComponent', () => {
  let component: PrLineHistoryGridComponent;
  let fixture: ComponentFixture<PrLineHistoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrLineHistoryGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrLineHistoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
