import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrLineGridViewComponent } from './pr-line-grid-view.component';

describe('PrLineGridViewComponent', () => {
  let component: PrLineGridViewComponent;
  let fixture: ComponentFixture<PrLineGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrLineGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrLineGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
