import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsApprovalUploadDocumentComponent } from './cs-approval-upload-document.component';

describe('CsApprovalUploadDocumentComponent', () => {
  let component: CsApprovalUploadDocumentComponent;
  let fixture: ComponentFixture<CsApprovalUploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsApprovalUploadDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsApprovalUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
