import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsApprovalMailComponent } from './cs-approval-mail.component';

describe('CsApprovalMailComponent', () => {
  let component: CsApprovalMailComponent;
  let fixture: ComponentFixture<CsApprovalMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsApprovalMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsApprovalMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
