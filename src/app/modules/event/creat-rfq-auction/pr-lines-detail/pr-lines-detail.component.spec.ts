import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrLinesDetailComponent } from './pr-lines-detail.component';

describe('PrLinesDetailComponent', () => {
  let component: PrLinesDetailComponent;
  let fixture: ComponentFixture<PrLinesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrLinesDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrLinesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
