import { TestBed } from '@angular/core/testing';

import { CsMailApprovalStatusService } from './cs-mail-approval-status.service';

describe('CsMailApprovalStatusService', () => {
  let service: CsMailApprovalStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsMailApprovalStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
