import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAnalysisHeaderInformationComponent } from './vendor-analysis-header-information.component';

describe('VendorAnalysisHeaderInformationComponent', () => {
  let component: VendorAnalysisHeaderInformationComponent;
  let fixture: ComponentFixture<VendorAnalysisHeaderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAnalysisHeaderInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAnalysisHeaderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
