import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDocumentsComponent } from './buyer-documents.component';

describe('BuyerDocumentsComponent', () => {
  let component: BuyerDocumentsComponent;
  let fixture: ComponentFixture<BuyerDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
