import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContinueComponentComponent } from './chat.continue.component.component';

describe('ChatContinueComponentComponent', () => {
  let component: ChatContinueComponentComponent;
  let fixture: ComponentFixture<ChatContinueComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatContinueComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatContinueComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
