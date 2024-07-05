import { TestBed } from '@angular/core/testing';

import { PurchaseRequistionServiceService } from './purchase-requistion-service.service';

describe('PurchaseRequistionServiceService', () => {
  let service: PurchaseRequistionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseRequistionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
