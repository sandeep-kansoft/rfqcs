import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalParameterVendorActionComponentComponent } from './technical-parameter-vendor-action-component.component';

describe('TechncialParameterVendorActionComponentComponent', () => {
  let component: TechnicalParameterVendorActionComponentComponent;
  let fixture: ComponentFixture<TechnicalParameterVendorActionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalParameterVendorActionComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalParameterVendorActionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
