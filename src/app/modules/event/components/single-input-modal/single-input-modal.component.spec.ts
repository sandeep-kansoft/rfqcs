import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInputModalComponent } from './single-input-modal.component';

describe('SingleInputModalComponent', () => {
  let component: SingleInputModalComponent;
  let fixture: ComponentFixture<SingleInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleInputModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
