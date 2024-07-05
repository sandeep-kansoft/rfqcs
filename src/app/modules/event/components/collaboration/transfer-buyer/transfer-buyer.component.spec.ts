import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBuyerComponent } from './transfer-buyer.component';

describe('TransferBuyerComponent', () => {
  let component: TransferBuyerComponent;
  let fixture: ComponentFixture<TransferBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferBuyerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
