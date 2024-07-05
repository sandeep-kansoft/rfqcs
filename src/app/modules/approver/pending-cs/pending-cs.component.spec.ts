import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCsComponent } from './pending-cs.component';

describe('PendingCsComponent', () => {
  let component: PendingCsComponent;
  let fixture: ComponentFixture<PendingCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
