import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrMinMaxComponent } from './pr-min-max.component';

describe('PrMinMaxComponent', () => {
  let component: PrMinMaxComponent;
  let fixture: ComponentFixture<PrMinMaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrMinMaxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrMinMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
