import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsItemListPopupComponent } from './cs-item-list-popup.component';

describe('CsItemListPopupComponent', () => {
  let component: CsItemListPopupComponent;
  let fixture: ComponentFixture<CsItemListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsItemListPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsItemListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
