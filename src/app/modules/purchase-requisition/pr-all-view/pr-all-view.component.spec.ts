import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrAllViewComponent } from './pr-all-view.component';

describe('PrAllViewComponent', () => {
  let component: PrAllViewComponent;
  let fixture: ComponentFixture<PrAllViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrAllViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrAllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
