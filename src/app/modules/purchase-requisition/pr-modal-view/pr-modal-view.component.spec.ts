import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrModalViewComponent } from './pr-modal-view.component';

describe('PrModalViewComponent', () => {
  let component: PrModalViewComponent;
  let fixture: ComponentFixture<PrModalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrModalViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
