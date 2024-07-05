import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrLineDeatailFormComponent } from './pr-line-deatail-form.component';

describe('PrLineDeataliFormComponent', () => {
  let component: PrLineDeatailFormComponent;
  let fixture: ComponentFixture<PrLineDeatailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrLineDeatailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrLineDeatailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
