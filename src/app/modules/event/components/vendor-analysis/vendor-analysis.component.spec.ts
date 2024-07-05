import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAnalysisComponent } from './vendor-analysis.component';

describe('VendorAnalysisComponent', () => {
  let component: VendorAnalysisComponent;
  let fixture: ComponentFixture<VendorAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
