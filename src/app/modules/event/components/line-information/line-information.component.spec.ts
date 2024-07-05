import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineInformationComponent } from './line-information.component';

describe('LineInformationComponent', () => {
  let component: LineInformationComponent;
  let fixture: ComponentFixture<LineInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
