import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsMailApprovalStatusDashboardComponent } from './cs-mail-approval-status-dashboard.component';

describe('CsMailApprovalStatusDashboardComponent', () => {
  let component: CsMailApprovalStatusDashboardComponent;
  let fixture: ComponentFixture<CsMailApprovalStatusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsMailApprovalStatusDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsMailApprovalStatusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
