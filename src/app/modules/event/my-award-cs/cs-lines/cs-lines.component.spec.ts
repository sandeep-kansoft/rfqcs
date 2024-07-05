import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsLinesComponent } from './cs-lines.component';

describe('CsLinesComponent', () => {
  let component: CsLinesComponent;
  let fixture: ComponentFixture<CsLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsLinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
