import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAddSubItemsComponent } from './vendor-add-sub-items.component';

describe('VendorAddSubItemsComponent', () => {
  let component: VendorAddSubItemsComponent;
  let fixture: ComponentFixture<VendorAddSubItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAddSubItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAddSubItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
