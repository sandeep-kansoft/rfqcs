import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDocumentPopupComponent } from './preview-document-popup.component';

describe('PreviewDocumentPopupComponent', () => {
  let component: PreviewDocumentPopupComponent;
  let fixture: ComponentFixture<PreviewDocumentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDocumentPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
