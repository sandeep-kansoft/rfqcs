import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAnalysisLineItemInformationComponent } from './vendor-analysis-line-item-information.component';

describe('VendorAnalysisLineItemInformationComponent', () => {
  let component: VendorAnalysisLineItemInformationComponent;
  let fixture: ComponentFixture<VendorAnalysisLineItemInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAnalysisLineItemInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAnalysisLineItemInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
