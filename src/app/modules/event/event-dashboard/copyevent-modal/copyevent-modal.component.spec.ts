import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyeventModalComponent } from './copyevent-modal.component';

describe('CopyeventModalComponent', () => {
  let component: CopyeventModalComponent;
  let fixture: ComponentFixture<CopyeventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyeventModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyeventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
