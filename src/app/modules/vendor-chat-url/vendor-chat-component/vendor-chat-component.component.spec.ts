import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorChatComponentComponent } from './vendor-chat-component.component';

describe('VendorChatComponentComponent', () => {
  let component: VendorChatComponentComponent;
  let fixture: ComponentFixture<VendorChatComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorChatComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorChatComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
