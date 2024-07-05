import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrHistoryDetailComponent } from './pr-history-detail.component';

describe('PrHistoryDetailComponent', () => {
  let component: PrHistoryDetailComponent;
  let fixture: ComponentFixture<PrHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrHistoryDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
