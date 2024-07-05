import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrGridViewComponent } from './pr-grid-view.component';

describe('PrGridViewComponent', () => {
  let component: PrGridViewComponent;
  let fixture: ComponentFixture<PrGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
