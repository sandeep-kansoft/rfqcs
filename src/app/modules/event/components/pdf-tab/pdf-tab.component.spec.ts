import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTabComponent } from './pdf-tab.component';

describe('PdfTabComponent', () => {
  let component: PdfTabComponent;
  let fixture: ComponentFixture<PdfTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
