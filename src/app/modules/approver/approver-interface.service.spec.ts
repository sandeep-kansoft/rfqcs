import { TestBed } from '@angular/core/testing';



describe('ApproverInterfaceService', () => {
  let service: ApproverInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
