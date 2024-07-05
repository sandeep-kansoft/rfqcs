import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDocumentUploadComponent } from './buyer-document-upload.component';

describe('BuyerDocumentUploadComponent', () => {
  let component: BuyerDocumentUploadComponent;
  let fixture: ComponentFixture<BuyerDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerDocumentUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
