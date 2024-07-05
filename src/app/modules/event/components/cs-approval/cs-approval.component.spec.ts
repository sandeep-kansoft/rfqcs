import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsApprovalComponent } from './cs-approval.component';

describe('CsApprovalComponent', () => {
  let component: CsApprovalComponent;
  let fixture: ComponentFixture<CsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
