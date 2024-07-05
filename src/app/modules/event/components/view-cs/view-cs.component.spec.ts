import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCSComponent } from './view-cs.component';

describe('ViewCSComponent', () => {
  let component: ViewCSComponent;
  let fixture: ComponentFixture<ViewCSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
