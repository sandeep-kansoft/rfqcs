import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTabHeaderInformationComponent } from './pdf-tab-header-information.component';

describe('PdfTabHeaderInformationComponent', () => {
  let component: PdfTabHeaderInformationComponent;
  let fixture: ComponentFixture<PdfTabHeaderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfTabHeaderInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfTabHeaderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
