import { TestBed } from '@angular/core/testing';

import { ReActiveEventStatusService } from './re-active-event-status.service';

describe('ReActiveEventStatusService', () => {
  let service: ReActiveEventStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReActiveEventStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
