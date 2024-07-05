import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrDetailViewComponent } from './pr-detail-view.component';

describe('PrDetailViewComponent', () => {
  let component: PrDetailViewComponent;
  let fixture: ComponentFixture<PrDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
