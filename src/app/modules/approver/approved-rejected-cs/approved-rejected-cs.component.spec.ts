import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRejectedCsComponent } from './approved-rejected-cs.component';

describe('ApprovedRejectedCsComponent', () => {
  let component: ApprovedRejectedCsComponent;
  let fixture: ComponentFixture<ApprovedRejectedCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedRejectedCsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRejectedCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
