import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextRoundComponentPopUpComponent } from './next-round-component-pop-up.component';

describe('NextRoundComponentPopUpComponent', () => {
  let component: NextRoundComponentPopUpComponent;
  let fixture: ComponentFixture<NextRoundComponentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextRoundComponentPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextRoundComponentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
