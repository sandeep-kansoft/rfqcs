import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTabLineInformationComponent } from './pdf-tab-line-information.component';

describe('PdfTabLineInformationComponent', () => {
  let component: PdfTabLineInformationComponent;
  let fixture: ComponentFixture<PdfTabLineInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfTabLineInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfTabLineInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
