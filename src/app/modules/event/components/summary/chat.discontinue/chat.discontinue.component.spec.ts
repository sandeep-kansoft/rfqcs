import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDiscontinueComponent } from './chat.discontinue.component';

describe('ChatDiscontinueComponent', () => {
  let component: ChatDiscontinueComponent;
  let fixture: ComponentFixture<ChatDiscontinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatDiscontinueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDiscontinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
