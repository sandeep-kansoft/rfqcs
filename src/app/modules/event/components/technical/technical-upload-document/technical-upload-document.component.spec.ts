import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalUploadDocumentComponent } from './technical-upload-document.component';

describe('TechnicalUploadDocumentComponent', () => {
  let component: TechnicalUploadDocumentComponent;
  let fixture: ComponentFixture<TechnicalUploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalUploadDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
