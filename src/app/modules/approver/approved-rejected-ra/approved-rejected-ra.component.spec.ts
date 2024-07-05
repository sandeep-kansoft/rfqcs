import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRejectedRAComponent } from './approved-rejected-ra.component';

describe('ApprovedRejectedRAComponent', () => {
  let component: ApprovedRejectedRAComponent;
  let fixture: ComponentFixture<ApprovedRejectedRAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedRejectedRAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRejectedRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
