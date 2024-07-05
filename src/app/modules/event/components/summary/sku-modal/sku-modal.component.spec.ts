import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuModalComponent } from './sku-modal.component';

describe('SkuModalComponent', () => {
  let component: SkuModalComponent;
  let fixture: ComponentFixture<SkuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
