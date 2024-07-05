import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRAComponent } from './pending-ra.component';

describe('PendingRAComponent', () => {
  let component: PendingRAComponent;
  let fixture: ComponentFixture<PendingRAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingRAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
